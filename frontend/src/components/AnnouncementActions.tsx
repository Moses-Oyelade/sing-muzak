"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "@/utils/axios";
import { useRouter } from "next/navigation";

interface Announcement {
  _id: string;
  title: string;
  content: string;
  publishedAt?: string;
}

export default function AnnouncementActions({
  announcement,
}: {
  announcement: Announcement
}) {
  const [title, setTitle] = useState(announcement.title);
  const [content, setContent] = useState(announcement.content);
  const [loading, setLoading] = useState(false);

  const route = useRouter();

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await axiosInstance.patch(
        `/announcements/${announcement._id}`,
        { title, content }
      );
      toast.success("Announcement updated");
      route.push("/announcements");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/announcements/${announcement._id}`);
      toast.success("Announcement deleted");
      //redirect to /announcements
        route.push("/announcements");
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <input
        type="text"
        className="border w-full p-2 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="border w-full p-2 rounded"
        rows={5}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex gap-4">
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Updating..." : "Update"}
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
