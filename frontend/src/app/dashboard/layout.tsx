"use client";

import { useState } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { useSession } from "next-auth/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();

  if (!session) return <p>Unauthorized</p>;

  const isAdmin = session.user?.role === "admin";

  const SidebarLinks = () => (
    <ul className="space-y-2 font-bold border rounded px-4 py-2 mx-1 mb-4 bg-slate-300">
      {isAdmin ? (
        <>
          <li className="px-3 hover:bg-slate-400 hover:underline">
            <Link href="/dashboard">Home</Link>
          </li>
          <li className="px-3 hover:bg-slate-400 hover:underline">
            <Link href="/dashboard/admin">Admin Panel</Link>
          </li>
        </>
      ) : (
        <>
          <li className="px-3 hover:bg-slate-400 hover:underline">
            <Link href="/dashboard/user">Profile</Link>
          </li>
          <li className="px-3 hover:bg-slate-400 hover:underline">
            <Link href="/dashboard">My Suggestions</Link>
          </li>
          <li className="px-3 hover:bg-slate-400 hover:underline">
            <Link href="/songs">Song List</Link>
          </li>
          <li className="px-3 hover:bg-slate-400 hover:underline">
            <Link href="">Vocal Members</Link>
          </li>
          <li className="px-3 hover:bg-slate-400 hover:underline">
            <Link href="/auth/logout">Logout</Link>
          </li>
        </>
      )}
    </ul>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-gray-100 p-4">
        <h3 className="font-bold text-lg mb-1">Hi, {session.user.name}</h3>
        <h4 className="text-sm mb-4">{session.user.phone}</h4>
        <h1 className="font-bold text-2xl mb-4">Dashboard</h1>
        <SidebarLinks />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 w-full flex items-center justify-between bg-white px-4 py-3 border-b z-50">
        <h2 className="text-lg font-bold">Dashboard</h2>
        <button onClick={() => setMenuOpen(true)} className="text-2xl">
          ☰
        </button>
      </div>

      {/* Mobile Slide-in Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-semibold text-lg">Menu</span>
          <button onClick={() => setMenuOpen(false)} className="text-2xl">
            ✕
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-md mb-1">Hi, {session.user.name}</h3>
          <h4 className="text-sm mb-4">{session.user.phone}</h4>
          <SidebarLinks />
        </div>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 mt-12 md:mt-0 w-full">{children}</main>
    </div>
  );
}
