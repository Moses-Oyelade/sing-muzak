"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const STATUSES = ["All", "Pending", "Approved"];
const socket = io("http://localhost:3000");

export default function AdminDashboard({ songs: initialSongs, meta }: { songs: any[]; meta: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("Pending");
  const [songs, setSongs] = useState(initialSongs);


  useEffect(() => {
    const queryStatus = searchParams.get("status");
    const querySearch = searchParams.get("search");

    setStatus(queryStatus || "Pending");
    setSearch(querySearch || "");
  }, [searchParams]);

  const handleSearch = () => {
    router.push(`/dashboard/admin?search=${search}&status=${status}&page=1`);
  };

  const handlePageChange = (newPage: number) => {
    router.push(`/dashboard/admin?search=${search}&status=${status}&page=${newPage}`);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    router.push(`/dashboard/admin?status=${newStatus}&search=${search}&page=1`);
  };

    // ✅ Real-time updates
    useEffect(() => {
      socket.on("new_song", (newSong) => {
        setSongs((prev) => [newSong, ...prev]);
      });
  
      socket.on("status_update", ({ songId, status }) => {
        setSongs((prev) =>
          prev.map((song) =>
            song._id === songId ? { ...song, status } : song
          )
        );
      });
  
      socket.on("song_removed", ({ songId }) => {
        setSongs((prev) => prev.filter((song) => song._id !== songId));
      });
  
      return () => {
        socket.off("new_song");
        socket.off("status_update");
        socket.off("song_removed");
      };
    }, []);

  return (
    <div>
      {/* Search + Filters */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full max-w-sm"
        />
        <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded">
          Search
        </button>
        <div className="flex gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              className={`px-3 py-1 rounded border ${
                s === status ? "bg-blue-600 text-white" : "bg-gray-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Song List */}
      <div className="space-y-4">
        {songs.map((song: any) => (
          <div key={song._id} className="p-4 border rounded shadow-sm">
            <h2 className="text-lg font-semibold">{song.title}</h2>
            <p>Status: <span className="uppercase text-xs bg-gray-200 px-2 py-1 rounded">{song.status}</span></p>

            {song.audioUrl && (
              <audio controls className="mt-2 w-full">
                <source src={song.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}

            {song.pdfUrl && (
              <iframe
                src={song.pdfUrl}
                className="w-full h-64 mt-4 border"
                title={`PDF for ${song.title}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {meta?.totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: meta.totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded border ${meta.currentPage === i + 1 ? "bg-blue-600 text-white" : ""}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
