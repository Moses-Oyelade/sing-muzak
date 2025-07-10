// hooks/useSocket.ts
"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

 // Change if hosted

export const useSocket = (onEvent: (data: any) => void) => {
  const socketRef = useRef<Socket | null>(null);


  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL);
    socketRef.current = socket;

    // Listen for notifications
    socket.on("notification", (data) => {
      console.log("📡 Notification received:", data);
      onEvent(data);
    });

    // Listen for song updates
    socket.on('status_update', (updatedSong) => {
      onEvent(updatedSong)
    });

    // Listen for new song added
    socket.on('new_song', (newSong) => {
      onEvent(newSong)
    });

    // Listen for song removed
    socket.on('songRemoved', (songId) => {
      onEvent(songId)
    });

    return () => {
      socket.disconnect();
    };
  }, [onEvent]);

  return socketRef.current;
};
