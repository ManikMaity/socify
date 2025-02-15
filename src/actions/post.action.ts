"use server"

import prisma from "@/lib/prisma";
import { getDBUserId } from "./user.action"
import { revalidatePath } from "next/cache";

export async function createPost(content: string, imageUrl: string) {
    try {
        const userId = await getDBUserId();
        if (!userId) return;
        const post = await prisma.post.create({
            data : {
                content,
                image: imageUrl,
                authorId: userId,
            }
        })

        revalidatePath("/");
        return {success : true, post};

    }
    catch (error) {
        return {success : false, error};
    }
}

export async function getPosts() {
    try {
        const posts = await prisma.post.findMany({
            orderBy : {createdAt : "desc"},
            include : {
                author : {
                    select : {
                        name : true,
                        image : true,
                        username : true,
                        _count : {
                            select : {
                                followers : true
                            }
                        }
                    }
                },
                comments : {
                    include : {
                        author : {
                            select : {
                                name : true,
                                image : true,
                                username : true
                            }
                        }
                    },
                    orderBy : {
                        createdAt : "asc"
                    }
                },
                likes : {
                    select : {
                        userId : true
                    }
                },
                _count : {
                    select : {
                        likes : true,
                        comments : true
                    }
                }
            }
        });

        return {success : true, posts};
    }
    catch(error){
        return {success : false, error};
    }
}

export async function toogleLike(postId : string) {
    try {
        const userId = await getDBUserId();
        if (!userId) return;

        // if post not found, throw error
        const post = await prisma.post.findUnique({
            where : {
                id : postId
            }
        });
        if (!post) throw new Error("Post not found");

        // if already liked, remove like
        const exitingLike = await prisma.like.findFirst({
            where : {
                postId : postId,
                userId : userId
            }
        });
        

        if (exitingLike) {
            await prisma.like.deleteMany({
                where : {
                    postId : postId,
                    userId : userId
                }
            })
        }
        else {
            await prisma.$transaction([
                prisma.like.create({
                    data : {
                        postId : postId,
                        userId : userId
                    }
                }),
                prisma.notification.create({
                    data : {
                        type :"LIKE",
                        creatorId : userId,
                        userId : post.authorId,
                        postId : postId
                    }
                })
            ]);
        }
        revalidatePath("/");
        return {success : true, likeType : exitingLike ? "dislike" : "like"};
    }
    catch(error){
        return {success : false, error};
    }
}
