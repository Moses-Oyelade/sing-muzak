"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useState } from "react";

const tabs = [
  { label: "Song Details", href: "/dashboard/" },
  { label: "Members", href: "/dashboard/user" },
  { label: "Performances", href: "/dashboard/admin/performances" },
  { label: "Rehearsals", href: "/dashboard/admin/reheasal" },
  { label: "Announcement", href: "/dashboard/admin/announcement" },
  { label: "Attendance", href: "/dashboard/admin/attendance" },
];

export default function MemberTabs() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Tabs */}
      <div className="hidden sm:flex gap-4 border-b mb-4 pb-2">
        {tabs.map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            className={clsx(
              "py-2 px-4",
              pathname === tab.href
                ? "border-b-2 border-blue-500 font-semibold"
                : "text-gray-600 hover:text-blue-600"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Mobile Header */}
      <div className="sm:hidden flex items-center justify-between border-b pb-2 mb-4">
        <h2 className="text-lg font-bold">Admin Panel</h2>
        <button
          onClick={() => setMenuOpen(true)}
          className="text-2xl px-3 py-1 focus:outline-none"
        >
          ☰
        </button>
      </div>

      {/* Slide-in Drawer */}
      <div
        className={clsx(
          "fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out",
          menuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="font-semibold text-lg">Menu</span>
          <button
            onClick={() => setMenuOpen(false)}
            className="text-2xl focus:outline-none"
          >
            ✕
          </button>
        </div>

        {/* Drawer Menu */}
        <nav className="flex flex-col p-4 space-y-2">
          {tabs.map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              onClick={() => setMenuOpen(false)}
              className={clsx(
                "py-2 px-3 rounded hover:bg-gray-100",
                pathname === tab.href ? "text-blue-600 font-semibold" : "text-gray-700"
              )}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Overlay when menu is open */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}
