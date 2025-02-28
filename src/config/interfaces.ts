import { getNotifications } from "@/actions/notification";
import { getPosts, getPostsByTextQuery, getUserBySearchQuery } from "@/actions/post.action";
import { getProfileFromUsername, getUserLikedPosts, isFollowingUser } from "@/actions/profile.action";
import { getReels } from "@/actions/reel.action";
import { Prisma } from "@prisma/client";
import { LucideIcon } from "lucide-react";

export interface NavLink {
    title: string;
    href: string;
    icon: LucideIcon;
}

export type UserWithCount = Prisma.UserGetPayload<{
    include: {
      _count: {
        select: {
          followers: true;
          following: true;
          posts: true;
        };
      };
    };
  }>;


  export type WhoToFollow = Prisma.UserGetPayload<{
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
    }
  }>


  export type HomePost = Awaited<ReturnType<typeof getPosts>>["posts"][0];


 export  interface AlertDialogProps {
    isDeleting : boolean,
    onDelete : () => Promise<void>,
    title? : string,
    description? : string,
    children? : React.ReactNode
}

export type NotificationsType = Awaited<ReturnType<typeof getNotifications>>
export type NotificationType = NotificationsType[number]

export type ProfileData = Awaited<ReturnType<typeof getProfileFromUsername>>;
export type LikedPostsData = Awaited<ReturnType<typeof getUserLikedPosts>>;
export type LikedPostData = LikedPostsData[number];
export type IsFollowing = Awaited<ReturnType<typeof isFollowingUser>>;


export interface  ImageUploadProps {
  onChange : (url : string) => void,
  value : string,
  endpoint : "postImage",
}


export type SearchPost =  Awaited<ReturnType<typeof getPostsByTextQuery>>["posts"][0];
export type SearchUser =  Awaited<ReturnType<typeof getUserBySearchQuery>>["users"][0];

export type TagUser = {
  id : string,
  name : string,
  username : string,
  image : string
}

export type ReelType = Awaited<ReturnType<typeof getReels>>["reels"][0];