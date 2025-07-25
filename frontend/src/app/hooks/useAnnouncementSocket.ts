"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  publishedAt?: string;
  updatedAt?: string;
}

export function useAnnouncementSocket(
  onNewAnnouncement: (announcement: Announcement) => void
) {
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL as string);

    socket.on("announcementCreated", (data: Announcement) => {
      if (data._id) {
        onNewAnnouncement(data);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [onNewAnnouncement]);
}
