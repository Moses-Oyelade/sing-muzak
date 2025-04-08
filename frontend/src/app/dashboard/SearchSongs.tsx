// app/dashboard/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import FilterBar from "@/components/FilterBar";
import SongCard from "@/components/SongCard";

export default function AdminDashboardPage() {
  const [songs, setSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSongs = async (term = "") => {
    try {
      const res = await fetch(`http://localhost:3000/songs?search=${term}`, {
        cache: "no-store",
      });
      const data = await res.json();
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
