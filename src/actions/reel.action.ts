"use server";

import prisma from "@/lib/prisma";
import { getDBUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export async function createReel (content : string, videoUrl : string) {
    try {
        const userId = await getDBUserId();
        if (!userId) throw new Error("Unauthorized");
        const reel = await prisma.reel.create({
            data : {
                content,
                videoUrl,
                authorId : userId,
            }
        });

          revalidatePath("/reel");
        return {success : true, reel};
    }
    catch(err){
        console.error(err);
        return {success : false};
    }
}

export async function getReels() {
    try {
        const reels = await prisma.reel.findMany({
            orderBy : {createdAt : "desc"},
            include : {
                author : {
                    select : {
                        id : true,
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
        })
        return {success : true, reels};
    }
    catch(err){
        console.error(err);
        return {success : false, reels : []};
    }
}

export async function toogleReelLike(reelId : string) {
    try {
         const userId = await getDBUserId();
               if (!userId) return;
       
               // if post not found, throw error
               const post = await prisma.reel.findUnique({
                   where : {
                       id : reelId
                   }
               });
               if (!post) throw new Error("Reel not found");
       
               // if already liked, remove like
               const exitingLike = await prisma.like.findFirst({
                   where : {
                       reelId : reelId,
                       userId : userId
                   }
               });
               
       
               if (exitingLike) {
                   await prisma.like.deleteMany({
                       where : {
                           reelId : reelId,
                           userId : userId
                       }
                   })
               }
               else {
                   await prisma.$transaction([
                       prisma.like.create({
                           data : {
                               reelId : reelId,
                               userId : userId
                           }
                       }),
                       prisma.notification.create({
                           data : {
                               type :"LIKE",
                               creatorId : userId,
                               userId : post.authorId,
                               reelId : reelId
                           }
                       })
                   ]);
               }
               revalidatePath("/reel");
               return {success : true, likeType : exitingLike ? "dislike" : "like"};
    }
    catch(err){
        console.error(err);
        return {success : false};   
    }
}


export async function createReelComment (content : string, reelId : string) {
    try {
        if (!content.trim()) throw new Error("Please enter some text");
        const userId = await getDBUserId();
        if (!userId) throw new Error("User not authenticated");
        // post not found, throw error
        const reel = await prisma.reel.findUnique({
            where : {
                id : reelId
            }
        });
        console.log(reel, userId);
        if (!reel) throw new Error("Reel not found");

        const [comment] = await prisma.$transaction(async (tx) => {
            const comment = await tx.comment.create({
                data : {
                    content,
                    autorId : userId,
                    reelId
                }
            });

            if (reel.authorId !== userId)
            {
                await tx.notification.create({
                    data : {
                        type : "COMMENT",
                        creatorId : userId,
                        userId : reel.authorId,
                        reelId
                    }
                });
            }

            return [comment];
        })

        

        revalidatePath("/reel")
        return {success : true, comment};
        
    }
    catch(error){
        console.log("Failed to create comment", error);
        return {success : false, error};
    }
}