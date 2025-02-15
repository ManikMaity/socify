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