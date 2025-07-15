"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import FilterBar from "@/components/FilterBar";
import SongCard from "@/components/SongCard";
import DownloadButton from "@/components/DownloadButton";

export default function SearchSong() {
  const [songs, setSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSongs = async (term = "") => {
    try {
      const res = await axiosInstance.get(`/songs?search=${term}`);
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
    <div className="p-4">
      <FilterBar onFilter={handleFilter} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {songs.length > 0 ? (
          songs.map((song: any) => (
            <div
              key={song._id}
              className="p-4 bg-blue-100 border rounded shadow-sm"
            >
              <SongCard song={song} />
              <div className="flex flex-wrap gap-2 mt-2">
                <DownloadButton songId={song._id} inline={true} />
                <DownloadButton songId={song._id} inline={false} />
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No songs found.</p>
        )}
      </div>
    </div>
  );
}
