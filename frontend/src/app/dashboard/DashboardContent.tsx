"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket"; // Import the custom hook
import axiosInstance from "src/utils/axios";
import dayjs from '@/lib/dayjs';
import FilterBar from "@/components/FilterBar";


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
  const [searchTerm, setSearchTerm] = useState("");

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

    // const fetchSuggestions = async() => {
    const fetchSuggestions = async(term = "") => {
      if (!session || !token) {
        console.warn("Session or token not ready, skipping fetch.");
        return;
      }
        
      try {
        const endpoint = role === 'admin'
          // ? "/songs"
          ? `/songs?search=${term}`
          : `/songs/me/suggestions`;

        console.log("Session:", session);
        console.log("Token extracted from session:", token);
        
        // const response = await axiosInstance.get(endpoint);
        const response = role === 'admin'
        ? await axiosInstance.get(endpoint, { })
        : await axiosInstance.get(endpoint);
        console.log("Fetching songs:", response.data);
        
        setSuggestions(response.data?.data || response.data ); // handle both paginated and non-paginated
      } catch (error) {
        console.error("Error fetching songs:", error);
        setSuggestions([]); // Ensure fallback
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions(searchTerm);
  // }, [token, role]);
  }, [session, searchTerm]);

  const handleFilter = (term: string) => {
    setSearchTerm(term);
  };

  if (loading) return <p className="p-4 animate-spin rounded-full h-4 w-4 border-t-2 border-white">Checking session...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        {role === "admin" ? 
        <>
        <p>"All Songs (admin)"</p>
        <FilterBar onFilter={handleFilter} /> 
        </>
        : "My Suggestions"}
      </h1>
  
      {suggestions.length === 0 ? (
        <p className="text-center text-gray-500">
          {role === "admin" ? "No songs available." : "No suggestions yet! 🎵"}
        </p>
      ) : (
        <ul className="space-y-4">
          {suggestions.map((song: any) => (
            <li key={song._id} className="border p-4 rounded">
              {role === 'admin' ?  (
              <>
              <h3 className="font-semibold text-lg">{song.title}</h3>
              <p>Artist: {song.artist}</p>
              <p>Status: {song.status}</p>
              <p>Uploaded By: {song.uploadedBy?.name || "unknown"}</p>
              <p>Uploaded on: {dayjs(song.createdAt).format('MMMM D, YYYY h:mm A')}</p>
              <p>Suggested By: {song.suggestedBy?.name || "unknown"}</p>
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
              </>           
              ) : (
              <>
              <h3 className="font-semibold text-lg">{song.title}</h3>
              <p>Artist: {song.artist}</p>
              <p>Status: {song.status}</p>
              <p>Uploaded By: {song.uploadedBy?.name || "unknown"}</p>
              <p>Uploaded on: {dayjs(song.createdAt).format('MMMM D, YYYY h:mm A')}</p>
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
              </>
            )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}  