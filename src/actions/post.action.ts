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