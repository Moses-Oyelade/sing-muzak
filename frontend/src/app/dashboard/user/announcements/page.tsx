"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import axiosInstance from "@/utils/axios";
import dayjs from "@/lib/dayjs";
import { useRouter } from "next/navigation";

interface Announcement {
  _id: string;
  title: string;
  content: string;
  publishedAt?: string;
  updatedAt?: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  const role = session?.user?.role;
  const isAdmin = role === "admin";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    const fetchAnnouncements = async () => {
      try {
        const res = await axiosInstance.get("/announcements");
        const sorted = res.data.sort((a: Announcement, b: Announcement) => {
          const dateA = new Date(a.updatedAt || a.publishedAt || "").getTime();
          const dateB = new Date(b.updatedAt || b.publishedAt || "").getTime();
          return dateB - dateA; // Newest first
        });
        setAnnouncements(sorted);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    if (status === "authenticated") {
      fetchAnnouncements();
    }
  }, [status, router]);

  if (status === "loading") return <div>Loading information...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Announcements</h1>
      <ul className="space-y-2">
        {announcements.map((a) => (
          <li key={a._id} className="border p-4 rounded">
            {isAdmin ? (
              <div className="flex justify-between items-center">
                <strong>{a.title}</strong>
                <Link href={`/dashboard/user/announcements/${a._id}`}>
                  <button className="text-blue-600 underline">Edit</button>
                </Link>
              </div>
            ) : (
              <Link href={`/announcements/${a._id}`}>
                <strong>{a.title}</strong>
              </Link>
            )}

            <p>{a.content.slice(0, 100)}...</p>

            <p>
              Published At:{" "}
              {a.publishedAt
                ? new Date(a.publishedAt).toLocaleDateString("en-GB")
                : "Not assigned"}{" "}
              <span className="text-gray-500">
                ({dayjs(a.publishedAt).fromNow()})
              </span>
            </p>

            {a.updatedAt && (
              <p className="text-sm text-yellow-700 mt-1">
                Last updated: {dayjs(a.updatedAt).format("DD MMM YYYY, h:mm A")} (
                {dayjs(a.updatedAt).fromNow()})
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
