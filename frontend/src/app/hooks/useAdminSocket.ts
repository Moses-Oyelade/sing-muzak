// hooks/useAdminSocket.ts
"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";

const socket = io(process.env.NEXT_PUBLIC_API_URL);

interface AdminSocketCallbackData {
  type: string;
  songId: string;
  status?: string;
}

type AdminSocketCallback = (data: AdminSocketCallbackData) => void;


export function useAdminSocket(setSongs: Function, callback: AdminSocketCallback ) {
  const socketRef = useRef<Socket | null>(null);
  
  useEffect(() => {
    socketRef.current = socket;

    socket.on("new_song", (newSong) => {
      setSongs((prev: any) => [newSong, ...prev]);
      toast.success(`🎶 New song uploaded: ${newSong.title}`);
    });

    socket.on("status_update", ({ songId, status }) => {
      setSongs((prev: any) =>
        prev.map((song: any) =>
          song._id === songId ? { ...song, status } : song
        )
      );
      toast.success(`✅ Song status updated to ${status}`);
    });

    socket.on("song_removed", ({ songId }) => {
      setSongs((prev: any) => prev.filter((song: any) => song._id !== songId));
      toast("🗑️ Song removed");
    });

    return () => {
      socket.off();
    };
  }, [setSongs]);
}
