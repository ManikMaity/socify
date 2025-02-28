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