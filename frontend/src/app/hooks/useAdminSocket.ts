"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";

const socket = io(process.env.NEXT_PUBLIC_API_URL);

interface AdminSocketSongData {
  type: string;
  songId: string;
  status?: string;
  title?: string;
}

interface AdminSocketUserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
  voicePart?: string;
  createdAt: string;
  updatedAt: string;
}

type SongCallback = (data: AdminSocketSongData) => void;
type UserCallback = (user: AdminSocketUserData) => void;

interface UseAdminSocketParams {
  setSongs: Function;
  onUserUpdate?: UserCallback;
  onNewSong?: SongCallback;
  onStatusUpdate?: SongCallback;
  onSongRemoved?: SongCallback;
}

export function useAdminSocket({
  setSongs,
  onUserUpdate,
  onNewSong,
  onStatusUpdate,
  onSongRemoved,
}: UseAdminSocketParams) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = socket;

    socket.on("new_song", (newSong) => {
      setSongs((prev: any) => [newSong, ...prev]);
      toast.success(`🎶 New song uploaded: ${newSong.title}`);
      if (onNewSong) onNewSong(newSong);
    });

    socket.on("status_update", ({ songId, status }) => {
      setSongs((prev: any) =>
        prev.map((song: any) =>
          song._id === songId ? { ...song, status } : song
        )
      );
      toast.success(`✅ Song status updated to ${status}`);
      if (onStatusUpdate) onStatusUpdate({ songId, status, type: "status_update" });
    });

    socket.on("song_removed", ({ songId }) => {
      setSongs((prev: any) => prev.filter((song: any) => song._id !== songId));
      toast("🗑️ Song removed");
      if (onSongRemoved) onSongRemoved({ songId, type: "song_removed" });
    });

    // New: Listen for user update event
    socket.on("user_updated", (updatedUser: AdminSocketUserData) => {
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
        toast.success(`👤 User updated: ${updatedUser.name}`);
      }
    });

    return () => {
      socket.off("new_song");
      socket.off("status_update");
      socket.off("song_removed");
      socket.off("user_updated");
    };
  }, [setSongs, onUserUpdate, onNewSong, onStatusUpdate, onSongRemoved]);
}
