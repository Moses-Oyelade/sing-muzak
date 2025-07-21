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

  // Placeholder for auth role check — replace with your logic
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
    }
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

  if (!user) return <p>User not found.</p>;

  return (
    <div className="p-6">
      <button
        className="mb-4 text-blue-600 hover:underline"
        onClick={() => router.push(backUrl)}
      >
        ← Back to list
      </button>

      <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
      <p>Email: {user.email}</p>
      {user.phone && <p>Phone: {user.phone}</p>}
      {user.address && <p>Address: {user.address}</p>}
      {user.voicePart && <p>Voice Part: {user.voicePart}</p>}
      <p>Role: {user.role}</p>
      <p>Joined: {dayjs(user.createdAt).format("MMMM D, YYYY")}</p>
      <p>Last Updated: {dayjs(user.updatedAt).format("MMMM D, YYYY h:mm A")}</p>

      <button
        className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={() => router.push(`/dashboard/admin/members/${id}/edit`)}
      >
        Edit User
      </button>
    </div>
  );
}
