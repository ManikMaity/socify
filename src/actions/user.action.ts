"use server";

import prisma from "@/lib/prisma";
import { generateUsername } from "@/lib/utilFunc";
import { auth, currentUser } from "@clerk/nextjs/server";

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
  }
}