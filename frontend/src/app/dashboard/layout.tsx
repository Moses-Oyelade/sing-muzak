"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useSession } from "next-auth/react";

const tabs = [
  { label: "Song List", href: "/dashboard" },
  { label: "Admin Panel", href: "/dashboard/admin" },
  // { label: "Song Details", href: "/dashboard/admin/songDetails" },
  { label: "Members", href: "/dashboard/admin/members" },
  { label: "Performances", href: "/dashboard/admin/performances" },
  { label: "Rehearsals", href: "/dashboard/admin/rehearsals" },
  { label: "Announcement", href: "/dashboard/user/announcements" },
  { label: "Attendance Report", href: "/dashboard/admin/rehearsals/trends" },
  { label: "Clean UP", href: "/dashboard/admin/cleanup" },
];

const userTabs = [
  { label: "Profile", href: "/dashboard/user/profile" },
  { label: "My Suggestions", href: "/dashboard" },
  { label: "Song List", href: "/dashboard/user/songs" },
  { label: "Vocal Members", href: "/dashboard/user" },
  { label: "Song Suggestion", href: "/dashboard/user/suggestSong" },
  { label: "Rehearsals", href: "/dashboard/user/rehearsals" },
  { label: "Announcement", href: "/dashboard/user/announcements" },
  // { label: "Attendance", href: "/dashboard/attendance" },
];
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session) return <p>Unauthorized</p>;

  const isAdmin = session.user?.role === "admin";

  const SidebarLinks = () => (
    <ul className="space-y-2 font-bold border md:mt-0 rounded px-4 py-2 mx-1 mb-4 bg-slate-300">
      {isAdmin ? (
        <>
          {tabs.map((tab) => (
          <li 
            key={`${tab.href}-${tab.label}`}
            className={clsx(
              "py-2 px-4",
              pathname === tab.href
                ? "border-b-2 border-blue-500 font-semibold"
                : "px-3 text-gray-600 hover:bg-slate-400 hover:underline"
            )}>
            <Link
              href={tab.href}
              onClick={() => setMenuOpen(false)}
            >
              {tab.label}
            </Link>
          </li>
          ))}
        </>
      ) : (
        <>
          {userTabs.map((tab) => (
          <li 
            key={`${tab.href}-${tab.label}`}
            className={clsx(
              "py-2 px-4",
              pathname === tab.href
                ? "border-b-2 border-blue-500 font-semibold"
                : "px-3 text-gray-600 hover:bg-slate-400 hover:underline"
            )}>
            <Link
              href={tab.href}
              onClick={() => setMenuOpen(false)}
            >
              {tab.label}
            </Link>
          </li>
          ))}
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
        <button onClick={() => setMenuOpen(true)} className="text-2xl px-3 py-1 focus:outline-none">
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
          <button 
            onClick={() => setMenuOpen(false)} 
            className="text-2xl focus:outline-none"
          >
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
