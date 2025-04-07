"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import SongCard from "@/components/SongCard";

export default function SongsListPage() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    // async function fetchSongs() {
    const fetchSongs = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/songs");
        setSongs(data);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    }
    fetchSongs();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Songs List</h2>
      <div className="space-y-4">
        {songs && songs.map((song: any) => (
          <SongCard key={song._id} song={song} />
        ))}
      </div>
    </div>
  );
}
