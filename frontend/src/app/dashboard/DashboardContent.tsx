"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket"; // Import the custom hook
import axiosInstance from "src/utils/axios";


interface Song {
  _id: string;
  title: string;
  artist: string;
  status: string;
  sheetMusicUrl?: string;
  audioUrl?: string;
}


// export default function DashboardContent({ user }: Props) {
export default function DashboardContent() {
  const [suggestions, setSuggestions] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  const token = session?.user?.token;
  const role = session?.user?.role;


    // ✅ Call useSocket here (top-level of component)
    useSocket((data: any) => {
      // if (!user) return;

      console.log("Received real-time data:", data);
  
      if (data.type === "status_update") {
        setSuggestions((prev: any) =>
          prev.map((song: any) =>
            song._id === data.songId ? { ...song, status: data.status } : song
          )
        );
      }
  
      if (data.type === "new_song") {
        setSuggestions((prev) => [data.song, ...prev]);
      }
  
      if (data.type === "song_removed") {
        setSuggestions((prev: any) => prev.filter((song: any) => song._id !== data.songId));
      }
    });
  
  useEffect(() => {
    const fetchSuggestions = async() => {
      if (!session || !token) {
        console.warn("Session or token not ready, skipping fetch.");
        return;
      }

    // const headers = { Authorization: `Bearer ${token}` };
        
      try {
        const endpoint = role === 'admin'
          ? "/songs"
          : `/users/me/suggestions`;

        console.log("Session:", session);
        console.log("Token extracted from session:", token);
        
        const response = await axiosInstance.get(endpoint);
        console.log("Fetching songs:", response.data);
        
        setSuggestions(response.data?.data || response.data ); // handle both paginated and non-paginated
      } catch (error) {
        console.error("Error fetching songs:", error);
        setSuggestions([]); // Ensure fallback
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  // }, [token, role]);
  }, [session]);

  if (loading) return <p className="p-4 animate-spin rounded-full h-4 w-4 border-t-2 border-white">Checking session...</p>;

  return (
    <div className="p-4">
      <button>Search Songs</button>
      <h1 className="text-2xl font-bold mb-4">
        {role === "admin" ? "All Songs (admin)" : "My Suggestions"}
      </h1>
      {loading ? (
        <p>Loading suggestions...</p>
      ) : suggestions.length === 0 ? (
        <p>No songs found.</p>
      ) : (
        <ul className="space-y-4">
          {suggestions.map((song: any) => (
            <li key={song._id} className="border p-4 rounded">
              <h3 className="font-semibold text-lg">{song.title}</h3>
              <p>Artist: {song.artist}</p>
              <p>Status: {song.status}</p>
              {song.sheetMusicUrl && (
                <a
                  href={song.sheetMusicUrl}
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
      )}
    </div>
  );
}
