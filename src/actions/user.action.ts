"use server";

import prisma from "@/lib/prisma";
import { generateUsername } from "@/lib/utilFunc";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) return;

    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    if (existingUser) return existingUser;
    const createdUser = await prisma.user.create({
      data: {
        username:
          user.username ||
          generateUsername(user.emailAddresses[0].emailAddress),
        clerkId: userId,
        name: `${user.firstName || "Default"} ${user.lastName || "Name"}`,
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      },
    });
    return createdUser;
  } catch (error) {
    console.log("Error while syncing user", error);
  }
}

export async function getUserDataByClerkId(clerkId: string) {
  try {
    const user = await prisma.user.findUnique({
      where : {
        clerkId : clerkId
      },
      include : {
        _count : {
          select : {
            followers : true,
            following : true,
            posts : true
          }
        }
      }
    });
    return user;
  }
  catch(error) {
    console.log("Error while getting user data", error);
    throw error;
  }
}

export async function getDBUserId() {
  const {userId : clerkId} = await auth();
  if (!clerkId) return null;
  const user = await getUserDataByClerkId(clerkId);
  if (!user) throw new Error("User not found");
  return user.id;
}

export async function getThreeRandomUsers() {
  try {
    const userId = await getDBUserId();
    if (!userId) return {success : false, users : []};
    const users = await prisma.user.findMany({
      where : {
        AND : [
          {NOT : {id : userId}},
          {NOT : {followers : {some : {followerId : userId}}}}
        ]
      },
      select :{
        id : true,
        name : true,
        username : true,
        image : true,
        _count : {
          select : {
            following : true
          }
        }
      },
      orderBy: {
        followers : {
          _count : "desc"
        }
      },
      take: 3,
    });

  return {success : true, users};

  }
  catch(error){
    console.log(error);
    return {success : false, users : []};
  }
}

export async function toogleFollow(followerId : string) {
  const userId = await getDBUserId();
  if (followerId === userId) throw new Error("You cannot follow yourself");
  if (!userId) throw new Error("You are not logged in");
  const exitingFollow = await prisma.follow.findFirst({
    where : {
      followerId : userId,
      followingId : followerId
    }
  });

  if (exitingFollow) {
    await prisma.follow.deleteMany({
      where : {
        followerId : userId,
        followingId : followerId
      }
    });
  }
  else {
    await prisma.$transaction([
      prisma.follow.create({
        data : {
          followerId : userId,
          followingId : followerId
        }
      }),

      prisma.notification.create({
        data : {
          type : "FOLLOW",
          userId : followerId,
          creatorId : userId,
        }
      })
    ])
  }
  revalidatePath("/");
  return {success : true, type : exitingFollow ? "unfollow" : "follow"};
}
