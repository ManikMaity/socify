"use server";

import prisma from "@/lib/prisma";
import { getDBUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export async function getProfileFromUsername(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        bio: true,
        website: true,
        location: true,
        createdAt: true,
        posts: {
          select: {
            id: true,
            content: true,
            image: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                name: true,
                image: true,
                username: true,
                _count: {
                  select: {
                    followers: true,
                  },
                },
              },
            },
            comments: {
              include: {
                author: {
                  select: {
                    name: true,
                    image: true,
                    username: true,
                  },
                },
              },
              orderBy: {
                createdAt: "asc",
              },
            },
            likes: {
              select: {
                userId: true,
              },
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            following: true,
            followers: true,
            posts: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    console.error("Error while getting profile", error);
    throw new Error("Error while getting profile");
  }
}

export async function getUserLikedPosts(userId: string) {
  try {
    const likedPost = await prisma.post.findMany({
      where: {
        likes: {
          some: {
            userId: userId,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
            _count: {
              select: {
                followers: true,
              },
            },
          },
        },
        comments: {
          include: {
            author: {
              select: {
                name: true,
                image: true,
                username: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return likedPost;
  } catch (error) {
    console.error("Error while getting user liked posts", error);
    throw new Error("Error while getting user liked posts");
  }
}

export async function updateUserData(formData: FormData) {
  try {
    const userId = await getDBUserId();
    if (!userId) throw new Error("User not authorised");

    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;
    const location = formData.get("location") as string;
    const website = formData.get("website") as string;

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: name,
        bio: bio,
        location: location,
        website: website,
      },
    });

    revalidatePath("/profile");
    return { success: true, user };
  } catch (error) {
    console.log("Error while updating user profile", error);
    throw new Error("Error while updating user profile");
  }
}

export async function isFollowingUser(userId: string) {
  try {
    const currentUserId = await getDBUserId();
    if (!currentUserId) throw new Error("You are not authenticated");
    const isFollowing = await prisma.follow.findFirst({
        where : {
            followerId : currentUserId,
            followingId : userId
        }
    })

    return !!isFollowing;
    
  } catch (error) {
    console.log("Error while checking if user is following", error);
    throw new Error("Error while checking if user is following");
  }
}
