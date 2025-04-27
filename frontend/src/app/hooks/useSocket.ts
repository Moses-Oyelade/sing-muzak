// hooks/useSocket.ts
"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";


const SOCKET_SERVER_URL = "http://localhost:3000"; // Change if hosted

export const useSocket = (onEvent: (data: any) => void) => {
  const socketRef = useRef<Socket | null>(null);
  const [songs, setSongs] = useState<any[]>([]);

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);
    socketRef.current = socket;

    // Listen for notifications
    socket.on("notification", (data) => {
      console.log("📡 Notification received:", data);
      onEvent(data);
    });

    // // Listen for song updates
    // socket.on('songStatusUpdated', (updatedSong) => {
    //   onEvent(updatedSong),
    //   setSongs((prevSongs) =>
    //     prevSongs.map((song) =>
    //       song._id === updatedSong._id ? updatedSong : song
    //     )
    //   );
    // });

    // // Listen for new song added
    // socket.on('newSongAdded', (newSong) => {
    //   onEvent(newSong)
    //   setSongs((prevSongs) => [...prevSongs, newSong]); // Add the new song to the list
    // });

    // // Listen for BrocastNewSong
    // socket.on('newSongAdded', (newSong) => {
    //   onEvent(newSong)
    //   setSongs((prevSongs) => [...prevSongs, newSong]); // Add the new song to the list
    // });
    
    // Listen for song removed
    socket.on('songRemoved', (songId) => {
      onEvent(songId)
      setSongs((prevSongs) => (prevSongs || []).filter((song) => song._id !== songId)); // Remove the song by ID
    });

    return () => {
      socket.disconnect();
    };
  }, [onEvent]);

  return socketRef.current;
};

// export default useSocket;