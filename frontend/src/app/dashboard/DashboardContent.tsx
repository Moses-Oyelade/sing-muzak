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
  uploadedBy?: {
    name?: string;
  };
  suggestedBy?: {
    name?: string;
  };
}

interface Suggestion {
  _id: string;
  song: Song;
  suggestedBy: {
    _id: string;
    name: string;
  };
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
          song._id === data.songId ? { ...song, song: { ...song.song, status: data.status || song.song.status } } : song
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
        const endpoint =
          role === "admin" ? `/songs?search=${term}` : `/songs/me/suggestions`;

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

  const handleFilter = (term: string) => {
    setSearchTerm(term);
  };

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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        {role === "admin" ? (
          <>
            <p>&quot;All Songs (admin)&quot;</p>
            <FilterBar onFilter={handleFilter} />
          </>
        ) : (
          "My Suggestions"
        )}
      </h1>

      {(role === "admin" && songs.length === 0) ||
      (role !== "admin" && suggestions.length === 0) ? (
        <p className="text-center text-gray-500">
          {role === "admin" ? "No songs available." : "No suggestions yet! 🎵"}
        </p>
      ) : (
        <div>
          {role === "admin" ? (
            <ul className="space-y-4">
              {songs.map(song => (
                <li key={song._id} className="border p-4 rounded">
                  <h3 className="font-semibold text-lg">{song.title}</h3>
                  <p>Artist: {song.artist}</p>
                  <p>Status: {song.status}</p>
                  <p>Uploaded By: {song.uploadedBy?.name || "unknown"}</p>
                  <p>
                    Uploaded on:{" "}
                    {dayjs(song.createdAt).format("MMMM D, YYYY h:mm A")}
                  </p>
                  <p>Suggested By: {song.suggestedBy?.name || "unknown"}</p>
                  {song.pdfUrl && (
                    <a
                      href={song.pdfUrl}
                      target="_blank"
                      rel="noopener"
                      className="text-purple-600 underline"
                    >
                      View PDF
                    </a>
                  )}
                  {song.audioUrl && (
                    <a
                      href={song.audioUrl}
                      target="_blank"
                      rel="noopener"
                      className="text-blue-600 underline ml-4"
                    >
                      Listen
                    </a>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-4">
              {suggestions.map(suggestion => (
                <li key={suggestion._id} className="border p-4 rounded">
                  <h3 className="font-semibold text-lg">{suggestion.song.title}</h3>
                  <p>Artist: {suggestion.song.artist}</p>
                  <p>Status: {suggestion.song.status}</p>
                  <p>Suggested By: {suggestion.suggestedBy.name || "unknown"}</p>
                  <p>
                    Suggested on:{" "}
                    {dayjs(suggestion.createdAt).format("MMMM D, YYYY h:mm A")}
                  </p>
                  {suggestion.song.pdfUrl && (
                    <a
                      href={suggestion.song.pdfUrl}
                      target="_blank"
                      rel="noopener"
                      className="text-purple-600 underline"
                    >
                      View PDF
                    </a>
                  )}
                  {suggestion.song.audioUrl && (
                    <a
                      href={suggestion.song.audioUrl}
                      target="_blank"
                      rel="noopener"
                      className="text-blue-600 underline ml-4"
                    >
                      Listen
                    </a>
                  )}
                  <button
                    onClick={() => handleCancelSuggestion(suggestion._id)}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Cancel Suggestion
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
