"use server";
import prisma from "@/lib/prisma";
import { getDBUserId } from "./user.action";

export async function getNotifications() {
    try {
        const userId = await getDBUserId();
        if (!userId) throw new Error("User not authenticated");
        const notifications = await prisma.notification.findMany({
            where: {
                userId,
            },
            include : {
                creator : {
                    select : {
                        id : true,
                        name : true,
                        image : true,
                        username : true
                    }
                },
                post : {
                    select : {
                        id : true,
                        content : true,
                        image : true,
                    }
                },
                reel : {
                    select: {
                        id : true,
                        content : true,
                        videoUrl: true,
                    }
                },
                comment : {
                    select : {
                        id : true,
                        content : true,
                        createdAt : true
                    }
                }
            },
            orderBy : {
                createdAt : "desc"
            }
            
        });
        return notifications;
    }
    catch (error) {
        console.log(error);
        throw new Error("Error while getting notifications");
    }
}

export async function getUnreadNotificationsCount() {
    try {
        const userId = await getDBUserId();
        if (!userId) throw new Error("User not authenticated");
        const data = await prisma.$transaction(async (tx) => {
            const count = await tx.notification.count({
                where : {
                    userId,
                    read : false
                }
            });
            const user = await tx.user.findUnique({
                where : {
                    id : userId
                },
                select : {
                    username : true
                }
            })

            return {count, username : user?.username || ""}
        })
       
        return {success : true, data};
    }
    catch (error) {
        console.log(error);
        return {success : false, count : 0};
    }
}

export async function markNotificationAsRead(notificationIds : string[]) {
    try {
        const userId = await getDBUserId();
        if (!userId) throw new Error("User not authenticated");
        await prisma.notification.updateMany({
            where : {
                id : {
                    in : notificationIds
                },
            },
            data : {
                read : true
            }
        });

        return {success : true};

    }
    catch(err){
        console.log(err);
        throw new Error("Error while marking notifications as read");
    }
}

