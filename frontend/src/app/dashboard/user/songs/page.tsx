"use client";

import { useEffect, useState } from "react";
// import axiosInstance from 'src/utils/axios'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SearchSong from "../../SearchSongs";

export default function SongsListPage() {
  // const [songs, setSongs] = useState([]);
  // const { data: session } = useSession();

  const router = useRouter();
  // const isAdmin = session?.user.role === "admin";

  const handleRoute = () => {
        router.push(`/dashboard/user/suggestSong`)
    }


  return (
    <div className="max-w-3xl mx-auto md:mr-2 p-2">
      <h2 className="text-2xl md:text-lg font-bold mb-4">Songs List </h2>
      <div className='gap-4 p-2'>
        {/* <button
          onClick={() => router.back()}
          className='mb-4 mr-6 px-4 py-2 rounded hover:bg-gray-300'
        >
          ⇐ Back
        </button> */}
        <button
          onClick={handleRoute}
          className="mb-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Suggest a Song
        </button>
      </div>
      <div className="space-y-3">
        <SearchSong />
      </div>
    </div>
  );
}
