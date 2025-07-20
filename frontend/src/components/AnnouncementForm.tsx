import { useState } from "react";

interface Props {
  onSubmit: (data: { title: string; content: string }) => void;
  initialData?: { title: string; content: string };
  isEdit?: boolean;
}

export default function AnnouncementForm({ onSubmit, initialData, isEdit }: Props) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content });
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
      <button className="px-4 py-2 bg-blue-600 text-white rounded" type="submit">
        {"Create"} Announcement
      </button>
    </form>
  );
}
