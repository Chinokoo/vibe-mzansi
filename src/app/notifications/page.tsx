"use client";

import NotificationSkeleton from "@/components/NotificationSkeleton";
import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationsAsRead,
} from "@/actions/notification.action";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircleIcon, UserPlusIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Notifications = Awaited<ReturnType<typeof getNotifications>>;
type Notification = Notifications[number];

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const data = await getNotifications();
        setNotifications(data);

        const unreadIds = data.filter((n) => !n.read).map((n) => n.id);
        if (unreadIds.length > 0) await markNotificationsAsRead(unreadIds);
      } catch (error) {
        toast.error(
          "Notification glitch! 🚫 Couldn't fetch the vibes, fam. 🔄"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  //getNotification function
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "LIKE":
        return <Heart className="w-4 h-4 text-red-500" />;

      case "COMMENT":
        return <MessageCircleIcon className="size-4 text-sky-500" />;
      case "FOLLOW":
        return <UserPlusIcon className="w-4 h-4 text-green-500" />;
    }
  };

  if (isLoading) return <NotificationSkeleton />;

  return (
    <div className="space-y-4">
      <Card className="mt-5">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Notifications</CardTitle>
            <span className="text-sm text-muted-foreground">
              {notifications.filter((n) => !n.read).length} unread
            </span>
          </div>
        </CardHeader>
        <CardContent className="">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                {" "}
                No notifications vibes found!
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex py-2 items-start gap-4 border-b hover:bg-muted/25 transition-colors ${
                    !notification.read ? "bg-muted/50" : ""
                  }`}
                >
                  <Avatar className="mt-1">
                    <AvatarImage
                      src={notification.creator.image ?? "/avatar.png"}
                    />
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      {getNotificationIcon(notification.type)}
                      <span>
                        <span className="font-medium">
                          {notification.creator.name ??
                            notification.creator.username}
                        </span>
                        {notification.type === "FOLLOW"
                          ? "started following you 🔥✨"
                          : notification.type === "LIKE"
                          ? "liked your post, fam! ❤️ your post vibes are being appreciated! 🚀✨"
                          : "💬 dropped commented on your post, fam. 🔥✨"}
                      </span>
                    </div>
                    {notification.post &&
                      (notification.type === "LIKE" ||
                        notification.type === "COMMENT") && (
                        <div className="pl-6 space-y-2">
                          <div className="text-sm text-muted-foreground rounded-md p-2 bg-muted/30 mt-2">
                            <p>{notification.post.content}</p>
                            {notification.post.image && (
                              <img
                                src={notification.post.image}
                                alt="Post Content"
                                className="mt-2 rounded-md w-full max-w-[200px] h-auto object-cover"
                              />
                            )}
                          </div>
                          {notification.type === "COMMENT" &&
                            notification.comment && (
                              <div className="text-sm p-2 bg-accent/50 rounded-md">
                                {notification.comment.content}
                              </div>
                            )}
                        </div>
                      )}
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}{" "}
                  </p>
                </div>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
