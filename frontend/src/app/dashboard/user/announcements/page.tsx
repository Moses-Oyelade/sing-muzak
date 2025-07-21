"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import axiosInstance from "@/utils/axios";
import dayjs from "@/lib/dayjs";
import { useRouter } from "next/navigation";
import AnnouncementForm from "@/components/AnnouncementForm";
import { useAnnouncementSocket } from "@/app/hooks/useAnnouncementSocket";

interface Announcement {
  _id: string;
  title: string;
  content: string;
  publishedAt?: string;
  updatedAt?: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showAnouncementForm, setShowAnnouncementForm] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  const role = session?.user?.role;
  const isAdmin = role === "admin";

  // Real-time update
  useAnnouncementSocket((newAnnouncement) => {
    setAnnouncements((prev) => [newAnnouncement, ...prev]);
  });



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
          return dateB - dateA;
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
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold mb-4">Announcements</h1>
        <button
          onClick={() => setShowAnnouncementForm((prev) => !prev)}
          className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showAnouncementForm ? "Hide Suggest Form" : "Suggest a New Song"}
        </button>
      </div>

      {showAnouncementForm && (
        <div className="mb-6">
          <AnnouncementForm
            onSubmit={(data) => {
              axiosInstance.post("/announcements", data);
              setShowAnnouncementForm(false);
            }}
          />
        </div>
      )}

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
