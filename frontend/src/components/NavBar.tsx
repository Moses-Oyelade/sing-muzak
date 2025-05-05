// app/components/Navbar.tsx
"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <div className="font-bold text-lg">🎵 SongManager</div>
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="hover:underline">Song List</Link>
        <Link href ="/auth/logout">
          <button  className="hover:underline">
            Logout
          </button>
        </Link>
      </div>
    </nav>
  );
}
