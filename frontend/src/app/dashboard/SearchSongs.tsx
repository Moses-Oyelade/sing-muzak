// app/dashboard/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import FilterBar from "@/components/FilterBar";
import SongCard from "@/components/SongCard";
import axiosInstance from "@/utils/axios";
import DownloadButton from "@/components/DownloadButton";


export default function SearchSong() {
  const [songs, setSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSongs = async (term = "") => {
    try {
      const endpoint = `/songs?search=${term}`
      const res = await axiosInstance.get(endpoint, {
      
      });
  
      const data = await res.data;
      setSongs(data);
    } catch (err) {
      console.error("Failed to fetch songs:", err);
    }
  };

  useEffect(() => {
    fetchSongs(searchTerm);
  }, [searchTerm]);

  const handleFilter = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div>
      <FilterBar onFilter={handleFilter} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {songs.length > 0 ? (
          songs.map((song: any) => 
          <div key={song._id} className="p-4 bg-blue-300 border rounded shadow">
            <SongCard  song={song} />
            <div   className="flex gap-2 mt-2">
              <DownloadButton songId={song._id} inline={true} />     {/* View PDF/MP3 in browser */}
              <DownloadButton songId={song._id} inline={false} />    {/* Trigger file download */}
            </div>
          </div>
        )
        ) : (
          <p>No songs found.</p>
        )}
      </div>
    </div>
  );
}
