import { HeartIcon, MessageCircleIcon, UserPlusIcon } from "lucide-react";

export const getNotificationIcon = (type: string) => {
    switch (type) {
      case "LIKE":
        return <HeartIcon className="size-4 text-red-500" />;
      case "COMMENT":
        return <MessageCircleIcon className="size-4 text-blue-500" />;
      case "FOLLOW":
        return <UserPlusIcon className="size-4 text-green-500" />;
      default:
        return null;
    }
  };