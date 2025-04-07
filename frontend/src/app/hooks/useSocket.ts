// hooks/useSocket.ts
"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:3000"; // Change if hosted

export const useSocket = (onEvent: (data: any) => void) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);
    socketRef.current = socket;

    // Listen for notifications
    socket.on("notification", (data) => {
      console.log("📡 Notification received:", data);
      onEvent(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [onEvent]);

  return socketRef.current;
};
