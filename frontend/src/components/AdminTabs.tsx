// app/dashboard/components/AdminTabs.tsx
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
    <div className="flex gap-4 border-b mb-4">
      {tabs.map((tab) => (
        <Link
          key={tab.label}
          href={tab.href}
          className={clsx(
            "py-2 px-4",
            pathname === tab.href
              ? "border-b-2 border-blue-500 font-semibold"
              : "text-gray-600"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
