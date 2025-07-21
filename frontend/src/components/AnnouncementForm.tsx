"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  onSubmit: (data: { title: string; content: string }) => void;
  initialData?: { title: string; content: string };
  isEdit?: boolean;
}

export default function AnnouncementForm({ onSubmit, initialData, isEdit }: Props) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if ( !title || !content ){
      alert('Please fill all fields');
      return;
    };

    try {
      onSubmit({ title, content });
      router.push("/dashboard/user/announcements");
    } catch (err) {
      alert(`Announcement failed: ${err}`)
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="w-full p-2 border"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <textarea
        className="w-full p-2 border"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        required
      />
      <div className="flex justify-between items-center">
        <button className="px-4 py-2 bg-blue-600 text-white rounded" type="submit">
          {loading ? "Sending..." : "Create"} Announcement
        </button>
        <button
          type="button"
          onClick={() => router.push('/dashboard/user/announcements')}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
