export interface Notification {
  id: string;
  type: "payment" | "alert" | "update";
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export function createNotification(
  type: Notification["type"],
  title: string,
  message: string,
): Notification {
  return {
    id: crypto.randomUUID(),
    type,
    title,
    message,
    timestamp: Date.now(),
    read: false,
  };
}

export function markAsRead(notification: Notification): Notification {
  return { ...notification, read: true };
}

export function filterUnread(notifications: Notification[]): Notification[] {
  return notifications.filter((n) => !n.read);
}
