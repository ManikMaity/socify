import { Bell, HeartIcon, MessageCircleIcon, UserPlusIcon } from "lucide-react";

export function generateUsername (email : string) {
    const baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, ""); 
    const uniqueSuffix = Date.now().toString().slice(-4); 
    return baseUsername + uniqueSuffix;
}
