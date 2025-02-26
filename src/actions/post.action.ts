"use server"

import prisma from "@/lib/prisma";
import { getDBUserId } from "./user.action"
import { revalidatePath } from "next/cache";

export async function createPost(content: string, imageUrl: string, taggedUsers: string[]) {
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

        if (taggedUsers.length > 0) {
            await prisma.taggedUser.createMany({
                data : taggedUsers.map(userId => ({
                    userId,
                    postId : post.id
                }))
            })
        }

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
                taggedUser : {
                    include : {
                        user : {
                            select : {
                                id : true,
                                name : true,
                                username : true,
                                image : true
                            }
                        }
                    }
                },
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
        });

        return {success : true, posts};
    }
    catch(error){
        return {success : false, posts : []};
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


export async function createComment (content : string, postId : string) {
    try {
        if (!content.trim()) throw new Error("Please enter some text");
        const userId = await getDBUserId();
        if (!userId) throw new Error("User not authenticated");
        // post not found, throw error
        const post = await prisma.post.findUnique({
            where : {
                id : postId
            }
        });
        console.log(post, postId);
        if (!post) throw new Error("Post not found");

        const [comment] = await prisma.$transaction(async (tx) => {
            const comment = await tx.comment.create({
                data : {
                    content : content,
                    autorId : userId,
                    postId : postId
                }
            })

            if(post.authorId !== userId) {
                await tx.notification.create({
                    data : {
                        type : "COMMENT",
                        creatorId : userId,
                        userId : post.authorId,
                        postId : postId,
                        commentId : comment.id
                    }
                })
            }
            return [comment];
        });

        revalidatePath("/")
        return {success : true, comment};
        
    }
    catch(error){
        console.log("Failed to create comment", error);
        return {success : false, error};
    }
}

export async function deletePost(postId : string) {
    try {
        const userId = await getDBUserId();
        const post = await prisma.post.findUnique({
            where : {
                id : postId
            }
        });
        if (!post) throw new Error("Post not found");
        if (post.authorId !== userId) throw new Error("User not authorized to delete this post");

        await prisma.post.delete({
            where : {
                id : postId
            }
        });

        revalidatePath("/");
        return {success : true};
    }
    catch(error){
        console.log("Error deleting post", error);
        return {success : false};
    }
}

export async function getPostsByTextQuery (text : string) {
    if (text.trim() == "") return {success : true, posts : []};
    const userId = await getDBUserId();
    if (!userId) throw new Error("Youre not authenticated");
    const posts = await prisma.post.findMany({
        where : {
            content : {contains : text}
        },
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
            }
        }
    });

    return {success : true, posts};
}

export async function getUserBySearchQuery (text : string) {
    if (text.trim() == "") return {success : true, users : []};
    const userId = await getDBUserId();
    if (!userId) throw new Error("Youre not authenticated");
    const users = await prisma.user.findMany({
        where : {
            OR : [
                {name : {contains : text}},
                {username : {contains : text}}
            ]
        },
        select : {
            id : true,
            name : true,
            username : true,
            image : true,
            _count : {
                select : {
                    followers : true,
                    following : true
                }
            }
        }
    });

    return {success : true, users};
}

export async function getPostById (postId : string) {
    try {
        const post = await prisma.post.findUnique({
            where : {
                id : postId
            },
            include : {
                taggedUser : {
                    include : {
                        user : {
                            select : {
                                id : true,
                                name : true,
                                username : true,
                                image : true
                            }
                        }
                    }
                },
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
        });

        return {success : true, post};
    }
    catch(error){
        console.log("Error getting post by id", error);
        return {success : false, post : null};
    }
}