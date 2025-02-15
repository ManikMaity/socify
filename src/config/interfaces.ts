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