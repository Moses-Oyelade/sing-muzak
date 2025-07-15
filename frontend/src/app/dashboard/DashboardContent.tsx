"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import axiosInstance from "src/utils/axios";
import dayjs from "@/lib/dayjs";
import FilterBar from "@/components/FilterBar";

interface Song {
  _id: string;
  title: string;
  artist: string;
  category: string;
  status: string;
  audioUrl?: string;
  pdfUrl?: string;
  createdAt: string;
  uploadedBy?: { name?: string };
  suggestedBy?: { name?: string };
}

interface Suggestion {
  _id: string;
  song: Song;
  suggestedBy: { _id: string; name: string };
  createdAt: string;
}

export default function DashboardContent() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: session, status } = useSession();
  const token = session?.user?.token;
  const role = session?.user?.role;

  useSocket((data: { type: string; songId: string; song?: Suggestion; status?: string }) => {
    if (data.type === "status_update") {
      setSuggestions(prev =>
        prev.map(song =>
          song._id === data.songId
            ? { ...song, song: { ...song.song, status: data.status || song.song.status } }
            : song
        )
      );
    }

    if (data.type === "new_song" && data.song) {
      setSuggestions(prev => [data.song as Suggestion, ...prev]);
    }

    if (data.type === "song_removed") {
      setSuggestions(prev => prev.filter(song => song._id !== data.songId));
    }
  });

  useEffect(() => {
    if (status !== "authenticated" || !session || !token || !role) return;

    const fetchSuggestions = async (term = "") => {
      try {
        const endpoint = role === "admin" ? `/songs?search=${term}` : `/songs/me/suggestions`;
        const response = await axiosInstance.get(endpoint);
        const data = response.data?.data || response.data;

        if (role === "admin") {
          setSongs(data);
        } else {
          setSuggestions(data);
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
        setSuggestions([]);
        setSongs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions(searchTerm);
  }, [status, session, token, role, searchTerm]);

  const handleFilter = (term: string) => setSearchTerm(term);

  const handleCancelSuggestion = async (suggestionId: string) => {
    try {
      await axiosInstance.delete(`/songs/unsuggest/${suggestionId}`);
      setSuggestions(prev => prev.filter(s => s._id !== suggestionId));
      alert("Suggestion Removed!");
    } catch (error) {
      console.error("Failed to delete suggestion:", error);
      alert("Could not cancel suggestion");
    }
  };

  if (loading)
    return (
      <p className="p-4 animate-spin rounded-full h-4 w-4 border-t-2 border-white">
        Checking session...
      </p>
    );

  const isAdmin = role === "admin";

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">
        {isAdmin ? "All Songs (admin)" : "My Suggestions"}
      </h1>

      {isAdmin && <FilterBar onFilter={handleFilter} />}

      {(isAdmin && songs.length === 0) || (!isAdmin && suggestions.length === 0) ? (
        <p className="text-center text-gray-500 mt-8">
          {isAdmin ? "No songs available." : "No suggestions yet! 🎵"}
        </p>
      ) : (
        <ul className="space-y-4 mt-4">
          {(isAdmin ? songs : suggestions).map((item: Song | Suggestion) => {
            const song = isAdmin ? (item as Song) : (item as Suggestion).song;
            const suggestedBy = isAdmin ? song.suggestedBy?.name : (item as Suggestion).suggestedBy.name;

            return (
              <li
                key={isAdmin ? (item as Song)._id : (item as Suggestion)._id}
                className="border p-4 rounded shadow-sm bg-white"
              >
                <h3 className="font-semibold text-lg sm:text-xl mb-1">{song.title}</h3>
                <p className="text-sm sm:text-base"><strong>Artist:</strong> {song.artist}</p>
                <p className="text-sm sm:text-base"><strong>Status:</strong> {song.status}</p>
                {isAdmin && (
                  <p className="text-sm sm:text-base">
                    <strong>Uploaded By:</strong> {song.uploadedBy?.name || "Unknown"}
                  </p>
                )}
                <p className="text-sm sm:text-base">
                  <strong>{isAdmin ? "Uploaded" : "Suggested"} on:</strong>{" "}
                  {dayjs(isAdmin ? song.createdAt : (item as Suggestion).createdAt).format(
                    "MMMM D, YYYY h:mm A"
                  )}
                </p>
                <p className="text-sm sm:text-base">
                  🙋 <strong>Suggested By:</strong> {suggestedBy || "Unknown"}
                </p>

                <div className="flex flex-wrap gap-4 mt-2">
                  {song.pdfUrl && (
                    <a
                      href={song.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 underline"
                    >
                      View PDF
                    </a>
                  )}
                  {song.audioUrl && (
                    <a
                      href={song.audioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Listen
                    </a>
                  )}
                </div>

                {!isAdmin && (
                  <button
                    onClick={() => handleCancelSuggestion((item as Suggestion)._id)}
                    className="mt-3 px-4 py-2 w-full sm:w-auto bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Cancel Suggestion
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
