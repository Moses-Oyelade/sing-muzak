"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import toast from "react-hot-toast";
import {
  deleteAllAnnouncements,
  deleteAllNotifications,
  deleteAllRehearsals,
} from "@/app/api/deteleAll";

const AdminCleanupPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [secret, setSecret] = useState("");
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<"announcements" | "notifications" | "rehearsals" | null>(null);

  const CLEANUP_SECRET = process.env.NEXT_PUBLIC_ADMIN_CLEANUP_SECURITY_CODE ?? "";

  const handleSecretSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (secret === CLEANUP_SECRET) {
      setValidated(true);
    } else {
      toast.error("Invalid secret code.");
    }
  };

  const handleDelete = async () => {
    if (!selectedType) return;

    try {
      setLoading(true);
      if (selectedType === "announcements") {
        await deleteAllAnnouncements();
      } else if (selectedType === "notifications") {
        await deleteAllNotifications();
      } else if (selectedType === "rehearsals") {
        await deleteAllRehearsals();
      }
      toast.success(`${selectedType} cleanup successful`);
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
      setDeleteModalOpen(false);
      setSelectedType(null);
    }
  };

  if (status === "loading") return <p>Loading...</p>;
  if (!session) {
    signIn();
    return null;
  }

  if (session.user.role !== "admin") {
    return <p className="text-center mt-10 text-red-600">Access Denied</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-md">
      {!validated ? (
        <form onSubmit={handleSecretSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold text-center">Enter Admin Secret</h2>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Enter secret code"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Verify
          </button>
        </form>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4 text-center">Admin Cleanup Panel</h2>
          <div className="space-y-3">
            {["announcements", "notifications", "rehearsals"].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedType(type as any);
                  setDeleteModalOpen(true);
                }}
                className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={loading}
              >
                Delete All {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            title={`Delete ${selectedType}`}
            message={`Are you sure you want to delete all ${selectedType}? This action cannot be undone.`}
            onConfirm={handleDelete}
            onCancel={() => {
              setDeleteModalOpen(false);
              setSelectedType(null);
            }}
          />
        </>
      )}
    </div>
  );
};

export default AdminCleanupPage;
