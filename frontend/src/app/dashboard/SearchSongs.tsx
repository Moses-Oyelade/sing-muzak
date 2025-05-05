// app/dashboard/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import FilterBar from "@/components/FilterBar";
import SongCard from "@/components/SongCard";
import axiosInstance from "@/utils/axios";
// import axiosInstance from "@/utils/axios";


export default function AdminDashboardPage() {
  const [songs, setSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSongs = async (term = "") => {
    try {
      const endpoint = `/songs?search=${term}`
      const res = await axiosInstance.get(endpoint, {
      
      });
      // const data = await res.json();
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {songs.length > 0 ? (
          songs.map((song: any) => <SongCard key={song._id} song={song} />)
        ) : (
          <p>No songs found.</p>
        )}
      </div>
    </div>
  );
}
