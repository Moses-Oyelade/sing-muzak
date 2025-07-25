"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import axiosInstance from "@/utils/axios";
import ConfirmModal from "@/components/common/ConfirmationModal";
import LoadingSpinner from "@/components/LoadingSpinner";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
  voicePart?: string;
  createdAt: string;
  updatedAt: string;
}

const voiceParts = ["soprano", "alto", "tenor", "bass"];
const roles = ["admin", "member"];

export default function EditUserPage() {
  // const { id } = useParams();
  const params = useParams();
  const router = useRouter();

  const id = params?.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Assuming current user ID is stored somewhere like localStorage or context
  const currentUserId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    axiosInstance
      .get(`/users/${id}`)
      .then((res) => setUser(res.data))
      .catch(() => {
        toast.error("Failed to load user data.");
        router.push(`/dashboard/admin/members/${id}`);
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!user) return;
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axiosInstance.patch(`/users/${id}`, user);
      toast.success("✅ User updated successfully.");
      router.push(`/dashboard/admin/members/${id}`);
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await axiosInstance.delete(`/users/${id}`);

      // // Optionally log to audit trail
      // await axiosInstance.post(`/audit-log`, {
      //   action: "delete_user",
      //   userId: id,
      //   performedBy: currentUserId,
      //   timestamp: new Date().toISOString(),
      //   details: {
      //     name: user?.name,
      //     email: user?.email,
      //   },
      // });

      toast.success("🗑️ User deleted successfully.");
      router.push(`/dashboard/admin/members`);
    } catch (err) {
      toast.error("Failed to delete user.");
    } finally {
      setDeleting(false);
      setShowConfirmModal(false);
    }
  };

  if (loading || !user) return <LoadingSpinner />;

  const isSelf = currentUserId === user.id;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* form inputs (same as before) */}
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={user.phone ?? ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={user.address ?? ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label>Role:</label>
          <select
            name="role"
            value={user.role}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Voice Part:</label>
          <select
            name="voicePart"
            value={user.voicePart ?? ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">None</option>
            {voiceParts.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-4 mt-6">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {submitting ? "Updating..." : "Update"}
          </button>

          <button
            type="button"
            onClick={() => router.push(`/dashboard/admin/members/${id}`)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            disabled={deleting || isSelf}
            className={`px-4 py-2 rounded text-white ml-auto ${
              isSelf ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {deleting ? "Deleting..." : isSelf ? "Cannot Delete Self" : "Delete User"}
          </button>
        </div>
      </form>

      <ConfirmModal
        isOpen={showConfirmModal}
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User?"
        message={`Are you sure you want to permanently delete ${user.name}? This action cannot be undone.`}
      />
    </div>
  );
}
