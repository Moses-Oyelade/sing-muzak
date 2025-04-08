"use client";

import { useSession } from 'next-auth/react';
import AdminSongCard from "@/components/AdminSongCard";



export default function AdminDashboard({ songs } : any) {
    const { data: session } = useSession();

  return (
    <div>
      {
      songs.length === 0 ? (
        <p>No pending Songs!</p>
      ) : (
        <div className="space-y-4">
          {songs.map((song: any) => (
            <AdminSongCard key={song._id} song={song} session={session} />
          ))}
        </div>
    )}
    </div>
  );
}


