"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axiosInstance from "@/utils/axios";
import dayjs from "@/lib/dayjs";
import toast from "react-hot-toast";

interface Song {
  _id: string;
  title: string;
  artist: string;
  status: string;
  sheetMusicUrl?: string;
  audioUrl?: string;
  suggestedBy?: {
    name: string;
  };
  updatedAt?: string;
}

const STATUSES = ["All", "Pending", "Approved", "Postponed"];
const socket = io(process.env.NEXT_PUBLIC_API_URL);

export default function AdminDashboard({
  songs: initialSongs,
  meta: initialMeta,
}: {
  songs: Song[];
  meta: any;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [songs, setSongs] = useState<Song[]>(initialSongs);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState(initialMeta);
  const [loading, setLoading] = useState(false);
  const [updatingSongId, setUpdatingSongId] = useState<string | null>(null);

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "All";
  const category = searchParams.get("category") || "";
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
    } catch (err) {
      console.error("Error fetching songs:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async () => {
    try {
      const res = await axiosInstance.get("/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const updateSongStatus = async (songId: string, newStatus: string) => {
    const confirmAction = window.confirm(`Are you sure you want to ${newStatus.toLowerCase()} this song?`);
    if (!confirmAction) return;

    setUpdatingSongId(songId);
    try {
      await axiosInstance.patch(`/songs/${songId}`, { status: newStatus });
      toast.success(`Song ${newStatus.toLowerCase()} successfully`);
      fetchSongs();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update song status");
    } finally {
      setUpdatingSongId(null);
    }
  };

  useEffect(() => {
    getCategories();
    fetchSongs();
  }, [search, status, category, page]);

  useEffect(() => {
    socket.on("new_song", (newSong) => {
      toast.success(`🎶 New song uploaded: ${newSong.title}`);
      setSongs((prev) => [newSong, ...prev]);
    });

    socket.on("status_update", ({ songId, status }) => {
      toast.success(`✅ Song status updated to ${status}`);
      setSongs((prev) => prev.map((song) => (song._id === songId ? { ...song, status } : song)));
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
    <div className="px-4 pb-2 max-w-6xl mx-auto">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          defaultValue={search}
          onChange={(e) =>
            router.push(`/dashboard/admin?search=${e.target.value}&status=${status}&category=${category}&page=1`)
          }
          className="border px-3 py-2 rounded w-full sm:w-64"
        />

        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-64"
        >
          <option value="">All Categories</option>
          {categories.map((cat: any) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => handleStatusChange(s)}
            className={`px-3 py-1 rounded border text-sm ${
              s === status ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Song List */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : songs.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {songs.map((song) => (
            <div key={song._id} className="p-4 border rounded bg-white text-sm">
              <h2 className="text-lg font-semibold">{song.title}</h2>
              <p>Status: <span className="uppercase text-xs bg-gray-200 px-2 py-1 rounded">{song.status}</span></p>
              {song.suggestedBy && (
                <p className="text-xs text-gray-600 mt-1">
                  Suggested by: <span className="font-medium">{song.suggestedBy.name}</span>
                </p>
              )}
              {song.updatedAt && (
                <p className="text-xs text-gray-500">
                  Updated: {dayjs(song.updatedAt).fromNow()}
                </p>
              )}
              {song.audioUrl && (
                <audio controls className="mt-2 w-full">
                  <source src={song.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
              {song.sheetMusicUrl && (
                <iframe
                  src={song.sheetMusicUrl}
                  className="w-full h-40 mt-3 border rounded"
                  title={`Sheet for ${song.title}`}
                />
              )}
              <div className="mt-3 flex flex-col sm:flex-row gap-2">
                <button
                  className={`text-white px-3 py-1 rounded ${
                    updatingSongId === song._id
                      ? "bg-green-300"
                      : "bg-green-500 hover:bg-green-400"
                  }`}
                  disabled={updatingSongId === song._id}
                  onClick={() => updateSongStatus(song._id, "Approved")}
                >
                  {updatingSongId === song._id ? "Updating..." : "Approve"}
                </button>
                <button
                  className={`text-white px-3 py-1 rounded ${
                    updatingSongId === song._id
                      ? "bg-yellow-300"
                      : "bg-yellow-500 hover:bg-yellow-400"
                  }`}
                  disabled={updatingSongId === song._id}
                  onClick={() => updateSongStatus(song._id, "Postponed")}
                >
                  {updatingSongId === song._id ? "Updating..." : "Postpone"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-red-600">No songs found.</p>
      )}

      {/* Pagination */}
      {meta?.totalPages > 1 && (
        <div className="mt-6 flex justify-center flex-wrap gap-2">
          {Array.from({ length: meta.totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded border ${
                meta.currentPage === i + 1 ? "bg-blue-600 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
