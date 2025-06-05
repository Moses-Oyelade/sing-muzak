// hooks/useAdminSocket.ts
"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const socket = io("http://localhost:3000");

export function useAdminSocket(setSongs: Function) {
  useEffect(() => {
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
      socket.off("new_song");
      socket.off("status_update");
      socket.off("song_removed");
    };
  }, [setSongs]);
}
