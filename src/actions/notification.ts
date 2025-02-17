"use server"

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