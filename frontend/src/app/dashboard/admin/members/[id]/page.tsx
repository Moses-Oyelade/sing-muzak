"use client";

import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import dayjs from "@/lib/dayjs";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorFallback from "@/components/ErrorFallback";
import { useAdminSocket } from "@/app/hooks/useAdminSocket";
import axiosInstance from "@/utils/axios";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  address?: string;
  role: string;
  voicePart?: string;
  createdAt: string;
  updatedAt: string;
}

export default function UserDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const id = params.id;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Placeholder for auth role check
  const userRole = "admin";

  useEffect(() => {
    if (userRole !== "admin") {
      toast.error("Access denied.");
      router.push("/dashboard/admin/members");
    }
  }, [userRole, router]);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/users/${id}`)
      .then((res) => {
        setUser(res.data);
        setError(null);
      })
      .catch(() => {
        setError("Failed to load user data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useAdminSocket({
    setSongs: setUser,
    onUserUpdate: (updatedUser) => {
      if (updatedUser.id === id) {
        setUser(updatedUser);
        toast.success("User data updated in real-time.");
      }
    },
  });

  const backUrl =
    `/dashboard/admin/members?` +
    [
      `search=${searchParams.get("search") ?? ""}`,
      `voicePart=${searchParams.get("voicePart") ?? ""}`,
      `role=${searchParams.get("role") ?? ""}`,
      `page=${searchParams.get("page") ?? "1"}`,
    ]
      .filter((q) => q.split("=")[1] !== "")
      .join("&");

  if (loading) return <LoadingSpinner />;

  if (error)
    return (
      <ErrorFallback
        message={error}
        onRetry={() => {
          setError(null);
          setLoading(true);
          axiosInstance.get(`/users/${id}`).then((res) => {
            setUser(res.data);
            setLoading(false);
          });
        }}
      />
    );

  if (!user) return <p className="text-center mt-10">User not found.</p>;

  return (
    <div className="px-4 sm:px-6 lg:px-8 bg-slate-200 shadow-md py-6 max-w-2xl mx-auto">
      <button
        className="mb-6 text-blue-600 hover:underline text-sm"
        onClick={() => router.push(backUrl)}
      >
        ← Back to list
      </button>
      <div className="w-16 h-16 rounded-full bg-gray-300 mx-auto mb-2 flex items-center justify-center text-xl font-bold">
              🎙{user.name.charAt(0).toUpperCase()}
            </div>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">{user.name}</h1>

      <div className="space-y-2 text-sm sm:text-base text-gray-700">
        <p>
          <span className="font-medium">Email:</span> {user.email}
        </p>
        {user.phone && (
          <p>
            <span className="font-medium">Phone:</span> {user.phone}
          </p>
        )}
        {user.gender && (
          <p>
            <span className="font-medium">Gender:</span> {user.gender}
          </p>
        )}
        {user.address && (
          <p>
            <span className="font-medium">Address:</span> {user.address}
          </p>
        )}
        {user.voicePart && (
          <p>
            <span className="font-medium">Voice Part:</span> {user.voicePart}
          </p>
        )}
        <p>
          <span className="font-medium">Role:</span> {user.role}
        </p>
        <p>
          <span className="font-medium">Joined:</span>{" "}
          {dayjs(user.createdAt).format("MMMM D, YYYY")}
        </p>
        <p>
          <span className="font-medium">Last Updated:</span>{" "}
          {dayjs(user.updatedAt).format("MMMM D, YYYY h:mm A")}
        </p>
      </div>

      <div className="mt-8">
        <button
          className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => router.push(`/dashboard/admin/members/${id}/edit`)}
        >
          Edit User
        </button>
      </div>
    </div>
  );
}
