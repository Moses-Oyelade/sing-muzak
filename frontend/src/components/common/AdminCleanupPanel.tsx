"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  deleteAllNotifications,
} from "@/app/api/deteleAll";
import {
  deleteAllRehearsals,
} from "@/app/api/deteleAll";
import {
  deleteAllAnnouncements,
} from "@/app/api/deteleAll";

export default function AdminCleanupPanel() {
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [loadingRehearsals, setLoadingRehearsals] = useState(false);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);

  const handleDeleteNotifications = async () => {
    if (!window.confirm("Delete ALL notifications?")) return;

    setLoadingNotifications(true);
    try {
      await deleteAllNotifications();
      toast.success("All notifications deleted");
      // Optionally refetch here
    } catch (error) {
      toast.error("Failed to delete notifications");
      console.error(error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleDeleteRehearsals = async () => {
    if (!window.confirm("Delete ALL rehearsals?")) return;

    setLoadingRehearsals(true);
    try {
      await deleteAllRehearsals();
      toast.success("All rehearsals deleted");
      // Optionally refetch here
    } catch (error) {
      toast.error("Failed to delete rehearsals");
      console.error(error);
    } finally {
      setLoadingRehearsals(false);
    }
  };

  const handleDeleteAnnouncements = async () => {
    if (!window.confirm("Delete ALL announcements?")) return;

    setLoadingAnnouncements(true);
    try {
      await deleteAllAnnouncements();
      toast.success("All announcements deleted");
      // Optionally refetch here
    } catch (error) {
      toast.error("Failed to delete announcements");
      console.error(error);
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto mt-6">
      <button
        onClick={handleDeleteNotifications}
        disabled={loadingNotifications}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loadingNotifications ? "Deleting Notifications..." : "Clear All Notifications"}
      </button>

      <button
        onClick={handleDeleteRehearsals}
        disabled={loadingRehearsals}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loadingRehearsals ? "Deleting Rehearsals..." : "Clear All Rehearsals"}
      </button>

      <button
        onClick={handleDeleteAnnouncements}
        disabled={loadingAnnouncements}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loadingAnnouncements ? "Deleting Announcements..." : "Clear All Announcements"}
      </button>
    </div>
  );
}
