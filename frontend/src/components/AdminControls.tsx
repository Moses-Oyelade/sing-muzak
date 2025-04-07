"use client";

import { useEffect, useState } from "react";
import { fetchFilterSongs } from "@/utils/api";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

export default function AdminDash() {
  const [songs, setSongs] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getSongs = async () => {
    // try {
    //   const data = await fetchFilterSongs({
    //     page,
    //     status: statusFilter,
    //     category: categoryFilter,
    //   });
    //   setSongs(data.data);
    //   setTotalPages(data.totalPages);
    // } catch (err) {
    //   console.error("Error loading songs:", err);
    // }
    try {
      const res = await fetch(`/api/songs?page=${page}&status=${statusFilter}&category=${categoryFilter}`);
      const data = await res.json();
      setSongs(data.data);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Error loading songs:", err);
    }
  };

  useEffect(() => {
    getSongs();
  }, [statusFilter, categoryFilter, page]);

  useEffect(() => {
    socket.on("song:uploaded", (newSong) => {
      alert(`🎶 New song uploaded: ${newSong.title}`);
      getSongs();
    });

    socket.on("song:status-updated", (updatedSong) => {
      alert(`✅ Song status updated: ${updatedSong.title} is now ${updatedSong.status}`);
      getSongs();
    });

    return () => {
      socket.off("song:uploaded");
      socket.off("song:status-updated");
    };
  }, []);


  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <select
          className="border p-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Approved">Approved</option>
          {/* <option value="Pending">Pending</option> */}
          <option value="Postponed">Postponed</option>
        </select>

        <select
          className="border p-2"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Worship">Worship</option>
          <option value="Praise">Praise</option>
          {/* Dynamically load from backend later */}
        </select>
      </div>

      {/* Song List */}
      <div className="grid gap-4">
        {songs.map((song: any) => (
          <div key={song._id} className="border p-4 rounded shadow-sm bg-white">
            <h3 className="text-lg font-semibold">{song.title}</h3>
            <p className="text-sm">Artist: {song.artist}</p>
            <p className="text-sm">Category: {song.category?.name}</p>
            <p className="text-sm">Status: {song.status}</p>

            {/* Actions */}
            <div className="mt-2 flex gap-2">
              <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                Approve
              </button>
              <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                Postpone
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="bg-gray-300 px-3 py-1 rounded"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="bg-gray-300 px-3 py-1 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
