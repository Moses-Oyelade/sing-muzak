"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AdminSongCard from "@/components/AdminSongCard";
import AdminControls from "@/components/AdminControls";
import { useSocket } from "../hooks/useSocket";


export default function AdminDashboard() {
  const [pendingSongs, setPendingSongs] = useState<any[]>([]);
  const [songs, setSongs] = useState<any[]>([]);

  
  useEffect(() => {
    async function fetchPendingSongs() {
      try {
        const { data } = await axios.get("/songs?status=Pending");
        setPendingSongs(data.data);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    }
    fetchPendingSongs();
  }, []);

  const fetchSongs = async () => {
    const res = await axios.get("/api/admin/songs"); // adjust this route
    setSongs(res.data);
  };

  // WebSocket real-time event listener
  useSocket((notification) => {
    console.log('🔔 Received:', notification);
    // Trigger refetch on new song upload or status change
    fetchSongs();
  });

  useEffect(() => {
    fetchSongs();
  }, []);

    

  // const handleStatusUpdate = async (songId: string, status: 'Approved') => {
  //   await axios.patch(`/songs/${songId}/status`, { status });
  //   setPendingSongs(prev => 
  //     prev.map(song => song._id === songId ? { ...song, status } : song )
  //   );
  // };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      {pendingSongs.length === 0 ? (
        <p>No pending Songs!</p>
      ) : (
        <div className="space-y-4">
          {pendingSongs.map((song: any) => (
            // <AdminSongCard key={song._id} song={song} setPendingSongs={setPendingSongs}/>
            <AdminSongCard key={song._id} song={song}/>
          ))}
          < AdminControls />
        </div>
      )}
    </div>
  );
}


