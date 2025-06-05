"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axiosInstance from "@/utils/axios"; // axios on client side
import dayjs from "@/lib/dayjs";
import toast from "react-hot-toast";

interface Song {
  _id: string;
  title: string;
  artist: string;
  status: string;
  sheetMusicUrl?: string;
  audioUrl?: string;
}

const STATUSES = ["All", "Pending", "Approved", "Postponed"];
const socket = io("http://localhost:3000");

export default function AdminDashboard({ songs: initialSongs, meta: initialMeta }: { songs: any[]; meta: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [songs, setSongs] = useState<Song[]>(initialSongs);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState(initialMeta);
  const [loading, setLoading] = useState(false);
  const [updatingSongId, setUpdatingSongId] = useState<string | null>(null);

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "All";
  const category = searchParams.get("category") || "All";
  const page = searchParams.get("page") || "1";


  const fetchSongs = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/songs/filter`, {
        params: {
          status: status === "All" ? undefined : status,
          search,
          category,
          page,
        },
      });
      const { data: newSongs, meta: newMeta } = res.data;
      setSongs(newSongs);
      setMeta(newMeta);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching songs:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
    fetchSongs();
  }, [search, status, category, page]);

  const getCategories = async () => {
    try {
      const res = await axiosInstance.get("/categories");
      const data = res.data
      setCategories(data || []);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const updateSongStatus = async (songId: string, newStatus: string) => {
    const confirmAction = window.confirm(`Are you sure you want to ${newStatus.toLowerCase()} this song?`);

    if (!confirmAction) return; // If user cancels, do nothing
    
    setUpdatingSongId(songId); // Start loading.

    try {
      await axiosInstance.patch(`/songs/${songId}`, {
        status: newStatus,
      });
      toast.success(`Song ${newStatus.toLowerCase()} successfully`);
      fetchSongs();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update song status");
    } finally {
      setUpdatingSongId(null); // Stop loading
    }
  };

  useEffect(() => {
    socket.on("new_song", (newSong) => {
      toast.success(`🎶 New song uploaded: ${newSong.title}`);
      setSongs((prev) => [newSong, ...prev]);
    });

    socket.on("status_update", ({ songId, status }) => {
      toast.success(
        `✅ ${songId.title} status updated to ${status}`
      );
      setSongs((prev) =>
        prev.map((song) => (song._id === songId ? { ...song, status } : song))
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

  const handleSearch = () => {
    router.push(`/dashboard/admin?search=${search}&status=${status}&category=${category}&page=1`);
  };

  const handleStatusChange = (newStatus: string) => {
    router.push(`/dashboard/admin?search=${search}&status=${newStatus}&category=${category}&page=1`);
  };

  const handleCategoryChange = (newCategory: string) => {
    router.push(`/dashboard/admin?search=${search}&status=${status}&category=${newCategory}&page=1`);
  };

  const handlePageChange = (newPage: number) => {
    router.push(`/dashboard/admin?search=${search}&status=${status}&category=${category}&page=${newPage}`);
  };

  return (
    <div>
      {/* Search + Filters */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by title..."
          defaultValue={search}
          onChange={(e) => router.push(`/dashboard/admin?search=${e.target.value}&status=${status}&page=1`)}
          className="border px-3 py-2 rounded w-full max-w-sm"
        />
        <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded">
          Search
        </button>
        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <select
            className="border p-2"
            value={category}
            onChange={(e) => {
              handleCategoryChange(e.target.value);
            }}
          >
            <option value="">All Categories</option>
            {categories.map((cat: any) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              className={`px-3 py-1 rounded border ${s === status ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="space-y-4">
          {Array.isArray(songs) && songs.length > 0 ? (
            songs.map((song: any) => (
              <div key={song._id} className="p-4 border rounded shadow-sm">
                <h2 className="text-lg font-semibold">{song.title}</h2>
                <p>
                  Status:{" "}
                  <span className="uppercase text-xs bg-gray-200 px-2 py-1 rounded">{song.status}</span>
                </p>
                {song.suggestedBy && (
                  <p className="text-sm text-gray-600">
                    Suggested by: <span className="font-medium">{song.suggestedBy?.name || "unknown"}</span>
                  </p>
                )}
                {song.suggestedBy && (
                  <p className="text-sm text-gray-600">
                    Updated at:{" "}
                    <span className="font-medium">
                      {dayjs(song.updatedAt).fromNow()}
                    </span>
                  </p>
                )}
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
                {/* Actions */}
              <div className="mt-3 flex gap-2">
                <button
                  className={`text-white px-3 py-1 rounded
                    ${ updatingSongId === song._id ? "bg-green-300"
                    : "bg-green-500 hover:bg-green-300"
                  }`}
                  disabled={updatingSongId === song._Id}
                  onClick={() => updateSongStatus(song._id, "Approved")}
                >
                  {updatingSongId === song._Id ? "updating..." : "Approve"}
                </button>
                <button
                  className={`text-white px-3 py-1 rounded
                    ${ updatingSongId === song._id ? "bg-yellow-300"
                    : "bg-yellow-500 hover:bg-yellow-300"
                  }`}
                  disabled={updatingSongId === song._Id}
                  onClick={() => updateSongStatus(song._id, "Postponed")}
                >
                  {updatingSongId === song._Id ? "updating..." : "Postpone"}
                </button>
              </div>
              </div>
            ))
          ) : (
            <p className="text-red-600">No songs found.</p>
          )}
        </div>
      )}

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
