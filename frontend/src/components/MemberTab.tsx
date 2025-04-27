// app/dashboard/components/AdminTabs.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const tabs = [
  { label: "Song List", href: "/dashboard/admin" },
  { label: "Upload song", href: "/dashboard/admin/approved" },
  { label: "Performances", href: "/dashboard/admin/pending" },
  { label: "Rehearsals", href: "/dashboard/admin/pending" },
  { label: "Announcement", href: "/dashboard/admin/pending" },
  { label: "Attendance", href: "/dashboard/admin/pending" },
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
