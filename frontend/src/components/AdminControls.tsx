"use client";

import axiosInstance from "@/utils/axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

export default function AdminControls() {
  const [songs, setSongs] = useState([]);
  const [statusTab, setStatusTab] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [updatingSongId, setUpdatingSongId] = useState<string | null>(null);

  const getSongs = async () => {
    setLoading(true);
    let url = `/songs/filter?page=${page}`;

    if (statusTab !== "All") {
      url += `&status=${statusTab}`;
    }

    if (categoryFilter) {
      url += `&search=${categoryFilter}`;
    }
    try {
      const res = await axiosInstance.get(url);
      // const data = await axiosInstance.get(
      //   `/songs?page=${page}&status=${statusTab}&search=${categoryFilter}`
      // );
      const data = await res.data;
      // setSongs(data.data.songs || data.data );
      console.log(`data: ${data.songs}, next: ${data.data.songs}`)
      setSongs(Array.isArray(data.songs) ? data.data.songs: [] );
      setTotalPages(data.data.totalPages || 1);
    } catch (err) {
      console.error("Error loading songs:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async () => {
    try {
      const res = await axiosInstance.get("/categories");
      const data = res.data
      setCategories(data || []);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  useEffect(() => {
    getSongs();
  }, [statusTab, categoryFilter, page]);

  useEffect(() => {
    getCategories();

    socket.on("song:uploaded", (newSong) => {
      toast.success(`🎶 New song uploaded: ${newSong.title}`);
      getSongs();
    });

    socket.on("song:status-updated", (updatedSong) => {
      toast.success(
        `✅ ${updatedSong.title} status updated to ${updatedSong.status}`
      );
      getSongs();
    });

    return () => {
      socket.off("song:uploaded");
      socket.off("song:status-updated");
    };
  }, []);

  const handleFilter = async(term: string) => {
    setStatusTab(term);
  }

  const updateSongStatus = async (songId: string, newStatus: string) => {
    const confirmAction = window.confirm(`Are you sure you want to ${newStatus.toLowerCase()} this song?`);

    if (!confirmAction) return; // If user cancels, do nothing
    
    setUpdatingSongId(songId); // Start loading.

    try {
      await axiosInstance.patch(`/songs/${songId}`, {
        status: newStatus,
      });
      toast.success(`Song ${newStatus.toLowerCase()} successfully`);
      getSongs();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update song status");
    } finally {
      setUpdatingSongId(null); // Stop loading
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto ">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-4">
        {["All", "Approved", "Pending", "Postponed"].map((tab) => ( 
          <button
            key={tab}
            className={`px-3 py-1 rounded ${
              statusTab === tab
                ? "bg-purple-600 text-white"
                : "bg-gray-400 text-black"
            }`}
            onClick={() => {
              console.log(tab)
              handleFilter(tab);
              // setStatusTab(tab);
              setPage(1);
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <select
          className="border p-2"
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
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

      {/* Song List */}
      {loading ? (
        <p className="text-center text-gray-600 animate-spin rounded-full h-4 w-4 border-t-2 border-white">Loading songs...</p>
      ) : songs.length === 0 ? (
        <p className="text-center text-red-500">No songs found.</p>
      ) : (
        <div className="grid gap-4">
          {songs.map((song: any) => (
            <div
              key={song._id}
              className="border p-4 rounded shadow-sm bg-white"
            >
              <h3 className="text-lg font-semibold">{song.title}</h3>
              <p className="text-sm">Artist: {song.artist}</p>
              <p className="text-sm">Category: {song.category}</p>
              <p className="text-sm">Status: {song.status}</p>

              {/* PDF Preview */}
              {song.sheetMusicUrl && (
                <iframe
                  src={song.sheetMusicUrl}
                  className="w-full h-40 border mt-2"
                  title={`Sheet music for ${song.title}`}
                />
              )}

              {/* Audio Preview */}
              {song.audioUrl && (
                <audio controls className="mt-2 w-full">
                  <source src={song.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}

              {/* Actions */}
              <div className="mt-3 flex gap-2">
                <button
                  className={`text-white px-3 py-1 rounded
                    ${ updatingSongId === song._id ? "bg-green-300"
                    : "bg-green-500 hover:bg-green-300 cursor-not-allowed"
                  }`}
                  disabled={updatingSongId === song._Id}
                  onClick={() => updateSongStatus(song._id, "Approved")}
                >
                  {updatingSongId === song._Id ? "updating..." : "Approve"}
                </button>
                <button
                  className={`text-white px-3 py-1 rounded
                    ${ updatingSongId === song._id ? "bg-yellow-300"
                    : "bg-yellow-500 hover:bg-yellow-300 cursor-not-allowed"
                  }`}
                  disabled={updatingSongId === song._Id}
                  onClick={() => updateSongStatus(song._id, "Postponed")}
                >
                  {updatingSongId === song._Id ? "updating..." : "Postpone"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
