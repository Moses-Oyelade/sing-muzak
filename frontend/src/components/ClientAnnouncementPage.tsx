// components/ClientAnnouncementPage.tsx
"use client";

import AnnouncementActions from "@/components/AnnouncementActions";

interface Announcement {
  _id: string;
  title: string;
  content: string;
  publishedAt?: string;
}

export default function ClientAnnouncementPage({
  announcement,
  isAdmin,
}: {
  announcement: Announcement;
  isAdmin: boolean;
}) {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">{announcement.title}</h1>
      <p className="mb-4">{announcement.content}</p>

      {isAdmin && (
        <AnnouncementActions announcement={announcement} />
      )}
    </div>
  );
}
