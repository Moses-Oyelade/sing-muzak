"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Props {
  user: {
    id: string;
    name: string;
    token: string;
    isAdmin?: boolean;
  };
}

export default function DashboardContent({ user }: Props) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSongs = async () => {
    try {
      const endpoint = user.isAdmin
        ? "http://localhost:3000/songs"
        : `http://localhost:3000/songs/user/${user.id}`;

      const { data } = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setSongs(data?.data || data); // handle both paginated and non-paginated
    } catch (error) {
      console.error("Error fetching songs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}</h1>
      {songs.length === 0 ? (
        <p>No songs found.</p>
      ) : (
        <div className="grid gap-4">
          {songs.map((song: any) => (
            <div key={song._id} className="p-4 border rounded shadow">
              <h2 className="text-xl font-semibold">{song.title} - {song.artist}</h2>
              <p>Status: <span className="font-medium">{song.status}</span></p>

              {song.audioUrl && (
                <audio controls className="mt-2">
                  <source src={song.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}

              {song.sheetMusicUrl && (
                <iframe
                  src={song.sheetMusicUrl}
                  className="mt-4 w-full h-64 border"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
