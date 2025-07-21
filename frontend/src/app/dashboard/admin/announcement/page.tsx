"use client"

import { useRouter } from "next/navigation";
import AnnouncementForm from "../../../../components/AnnouncementForm"
import axiosInstance from "@/utils/axios";

export default function CreateAnnouncement() {
  const router = useRouter();

  const handleCreate = async (data: { title: string; content: string }) => {
    await axiosInstance.post("/announcements", data);
    router.push("/dashboard/user/announcements");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Create Announcement</h1>
      <AnnouncementForm onSubmit={handleCreate} isEdit={false} />
    </div>
  );
}
