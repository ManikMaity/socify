import { BellIcon, HomeIcon, User } from "lucide-react";
import { NavLink } from "./interfaces";

export const navLinks : NavLink[] = [
  {
    title: "Home",
    href: "/",
    icon: HomeIcon,
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
