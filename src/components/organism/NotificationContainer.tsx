/* eslint-disable @next/next/no-img-element */
"use client"

import { getNotifications, markNotificationAsRead } from "@/actions/notification";
import { NotificationType } from "@/config/interfaces";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { NotificationsSkeleton } from "../atoms/skelitons/NotificationSkeliton";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { getNotificationIcon } from "@/lib/utilJsx";

function NotificationContainer() {



    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [laoding, setLoading] = useState(false);

    function getLikedMessage (notification: NotificationType) {
      if (notification.type === "FOLLOW"){
        return "started following you"
      }
      else if (notification.type === "LIKE" && notification.reelId){
        return "liked your reel"
      }
      else{
        return "liked your post"
      }
    }

    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const data = await getNotifications();
        setNotifications(data);
        const unreadNotifications = data.filter(notification => !notification.read).map(notification => notification.id);
        if (unreadNotifications.length > 0) await markNotificationAsRead(unreadNotifications);
      }
      catch (error) {
        console.log(error);
        toast.error("Error while getting notifications");
      }
      finally {
        setLoading(false);
      }
    }

    useEffect(() => {
      fetchNotifications();
    }, [])

    console.log(notifications);

    if (laoding) return <NotificationsSkeleton/>
    


  return (
    <div className="space-y-4">
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle>Notifications</CardTitle>
          <span className="text-sm text-muted-foreground">
            {notifications.filter((n) => !n.read).length} unread
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-12rem)]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">No notifications yet</div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-4 border-b hover:bg-muted/25 transition-colors ${
                  !notification.read ? "bg-muted/50" : ""
                }`}
              >
                <Avatar className="mt-1">
                  <AvatarImage src={notification.creator.image ?? "/avatar.png"} />
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    {getNotificationIcon(notification.type)}
                    <span>
                      <span className="font-medium">
                        {notification.creator.name ?? notification.creator.username}
                      </span>{" "}
                      {getLikedMessage(notification)}
                    </span>
                  </div>

                  {notification.post &&
                    (notification.type === "LIKE" || notification.type === "COMMENT") && (
                      <div className="pl-6 space-y-2">
                        <div className="text-sm text-muted-foreground rounded-md p-2 bg-muted/30 mt-2">
                          <p>{notification.post.content}</p>
                          {notification.post.image && (
                            <img
                              src={notification.post.image}
                              alt="Post content"
                              className="mt-2 rounded-md w-full max-w-[200px] h-auto object-cover"
                            />
                          )}
                        </div>

                        {notification.type === "COMMENT" && notification.comment && (
                          <div className="text-sm p-2 bg-accent/50 rounded-md">
                            {notification.comment.content}
                          </div>
                        )}
                      </div>
                    )}

                  {notification.reel &&
                    (notification.type === "LIKE" || notification.type === "COMMENT") && (
                      <div className="pl-6 space-y-2">
                        <div className="text-sm text-muted-foreground rounded-md p-2 bg-muted/30 mt-2">
                          <p>{notification.reel.content}</p>
                          {notification.reel.videoUrl && (
                            <video
                              src={notification.reel.videoUrl}
                              className="mt-2 rounded-md w-auto max-h-[200px] object-cover"
                            />
                          )}
                        </div>

                        {notification.type === "COMMENT" && notification.comment && (
                          <div className="text-sm p-2 bg-accent/50 rounded-md">
                            {notification.comment.content}
                          </div>
                        )}
                      </div>
                    )}

                  <p className="text-sm text-muted-foreground pl-6">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  </div>
  )
}

export default NotificationContainer
