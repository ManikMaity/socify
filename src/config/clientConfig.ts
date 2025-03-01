import { BellIcon, HomeIcon, User, Video } from "lucide-react";
import { NavLink } from "./interfaces";

export const navLinks : NavLink[] = [
  {
    title: "Home",
    href: "/",
    icon: HomeIcon,
  },
  {
    title: "Reels",
    href: "/reel",
    icon: Video,
  },
  {
    title: "Notification",
    href: "/notification",
    icon: BellIcon,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  }
 
];
