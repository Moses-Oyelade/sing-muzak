// app/components/Navbar.tsx
"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <Link href="/" className="font-bold text-lg">🎵 SongManager</Link>
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin" className="hover:underline">Admin</Link>
        <button onClick={() => signOut()} className="hover:underline">
          Logout
        </button>
      </div>
    </nav>
  );
}
