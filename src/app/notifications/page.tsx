"use client";

import NotificationSkeleton from "@/components/NotificationSkeleton";
import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationsAsRead,
} from "@/actions/notification.action";
import toast from "react-hot-toast";

type Notifications = Awaited<ReturnType<typeof getNotifications>>;
type Notification = Notifications[number];

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) return <NotificationSkeleton />;

  return <div>Notification Page</div>;
}
