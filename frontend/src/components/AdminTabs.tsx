"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const tabs = [
  { label: "Song Details", href: "/dashboard/admin/songDetails" },
  { label: "Members", href: "/dashboard/admin/members" },
  { label: "Performances", href: "/dashboard/admin/performances" },
  { label: "Rehearsals", href: "/dashboard/admin/reheasal" },
  { label: "Announcement", href: "/dashboard/admin/announcement" },
  { label: "Attendance", href: "/dashboard/admin/attendance" },
];

export default function AdminTabs() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-2 sm:gap-4 border-b pb-2 mb-4 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <Link
          key={tab.label}
          href={tab.href}
          className={clsx(
            "px-3 py-1 text-sm whitespace-nowrap rounded transition-colors",
            pathname === tab.href
              ? "bg-blue-600 text-white font-semibold shadow"
              : "text-gray-600 hover:bg-gray-100"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
