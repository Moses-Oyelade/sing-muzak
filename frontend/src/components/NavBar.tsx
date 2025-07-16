// app/components/Navbar.tsx
"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
// import { signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  const currentUser = session?.user;
  const role = currentUser?.role;

  const isAdmin = role === "admin";

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <div className="font-bold text-lg">
        {isAdmin ? (
        '🎵Song Management.' ): (`🎵 Welcome ${currentUser?.name}.` )
        }
        </div>
      <div className="flex items-center gap-4">
        { isAdmin ? 
          <Link href="/dashboard" className="hover:underline">Song List</Link> :
          <Link href="/songs" className="hover:underline">Song List</Link>
        }
        <Link href ="/auth/logout">
          <button  className="hover:underline">
            Logout
          </button>
        </Link>
      </div>
    </nav>
  );
}
