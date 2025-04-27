"use client";

import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";
import { useSession } from "next-auth/react";
import SongCard from "@/components/SongCard";
import AdminControls from "@/components/AdminControls";
import Link from "next/link";


export default function SongsListPage() {
  const [songs, setSongs] = useState([]);
  const { data: session } = useSession();

  
  const isAdmin = session?.user.role === "admin";

  useEffect(() => {
    // async function fetchSongs() {
    const fetchSongs = async () => {
      try {
        const res = await axiosInstance.get("/songs");
        const data = res.data
        setSongs(data || []);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    }
    fetchSongs();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <p><Link href='/dashboard'>⬅ back</Link></p>
      <h2 className="text-2xl font-bold mb-4">Songs List </h2>
      <div className="space-y-4">
        { isAdmin ? (
          <AdminControls />
        ) : (
          songs || []).map((song: any) => (
          <SongCard key={song._id} song={song} />
          )
        )}
      </div>
    </div>
  );
}
