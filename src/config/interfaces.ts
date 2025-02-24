import { getNotifications } from "@/actions/notification";
import { getProfileFromUsername, getUserLikedPosts, isFollowingUser } from "@/actions/profile.action";
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


  export type HomePost = Prisma.PostGetPayload<{
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
  }>


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
