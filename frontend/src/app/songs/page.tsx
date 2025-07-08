"use client";

import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminControls from "@/components/AdminControls";
import Link from "next/link";
import SearchSong from "../dashboard/SearchSongs";


export default function SongsListPage() {
  const [songs, setSongs] = useState([]);
  const { data: session } = useSession();

  const router = useRouter();
  const isAdmin = session?.user.role === "admin";

  const handleRoute = () => {
        router.push(`/suggestSong`)
    }


  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Songs List </h2>
      <div className='gap-6 p-4'>
        <button
          onClick={() => router.back()}
          className='mb-4 mr-6 px-4 py-2 rounded hover:bg-gray-300'
        >
          ⇐ Back
        </button>
        <button
          onClick={handleRoute}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Suggest a Song
        </button>
      </div>
      <div className="space-y-4">
        { isAdmin ? (
          <AdminControls />
        ) : (
        <SearchSong />
      )}
      </div>
    </div>
  );
}
