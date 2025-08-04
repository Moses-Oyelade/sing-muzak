"use client";

import axiosInstance from "@/utils/axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const VOCALPART = ["All", "soprano", "alto", "tenor", "bass", "pending"];
const ROLE = ["All", "admin", "member"];

interface User {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  role: string;
  voicePart: string;
  updatedAt: string;
}

interface Meta {
  totalPages: number;
  currentPage: number;
  total: number;
}

interface UserCardProps {
  users: User[];
  meta: Meta;
}

const socket = io(process.env.NEXT_PUBLIC_API_URL);

export default function UserCard({ users: initialUsers, meta: initialMeta }: UserCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [users, setUsers] = useState<User[]>(initialUsers);
  const [meta, setMeta] = useState<Meta>(initialMeta);
  const [loading, setLoading] = useState(false);

  const search = searchParams.get("search") || "";
  const voicePart = searchParams.get("voicePart") || "All";
  const role = searchParams.get("role") || "All";
  const page = searchParams.get("page") || "1";

  const getUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/users/filter", {
        params: {
          voicePart: voicePart === "All" ? undefined : voicePart,
          search,
          role,
          page,
        },
      });
      const { data: newUsers, meta: newMeta } = res.data;
      setUsers(newUsers);
      setMeta(newMeta);
      setLoading(false);
    } catch (err) {
      console.error("Error loading users:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, [search, voicePart, role, page]);

  useEffect(() => {
    socket.on("new_user", (newUser) => {
      toast.success(`🎶 New member: ${newUser.name} added`);
      setUsers((prev) => [newUser, ...prev]);
    });

    socket.on("voicePart_update", ({ userId, voicePart }) => {
      toast.success(`✅ Voice-part updated to ${voicePart}`);
      setUsers((prev) =>
        prev.map((user) => (user._id === userId ? { ...user, voicePart } : user))
      );
    });

    socket.on("user_removed", ({ userId }) => {
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    });

    return () => {
      socket.off("new_user");
      socket.off("voicePart_update");
      socket.off("user_removed");
    };
  }, []);

  const handlePageChange = (newPage: number) => {
    router.push(
      `/dashboard/admin/members?search=${search}&voicePart=${voicePart}&role=${role}&page=${newPage}`
    );
  };
  const handleVoicePartChange = (newVoicePart: string) => {
    router.push(
      `/dashboard/admin/members?search=${search}&voicePart=${newVoicePart}&role=${role}&page=${page}`
    );
  };


  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          defaultValue={search}
          onChange={(e) =>
            router.push(`/dashboard/admin/members?search=${e.target.value}&voicePart=${voicePart}&role=${role}&page=${page}`)
          }
          className="border px-3 py-2 rounded w-full sm:w-64"
        />

        <select
          value={voicePart}
          onChange={(e) => handleVoicePartChange(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-64"
        >
          <option value="">Voice-Part</option>
          {VOCALPART.map((v: any) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : users.length > 0 ? (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="p-4 border rounded  bg-slate-100 shadow-sm cursor-pointer hover:bg-gray-300"
              onClick={() => router.push(`/dashboard/admin/members/${user._id}`)}
            >
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-base">
                Voice-part:{" "}
                <span className="uppercase text-base text-white bg-gray-600 px-2 py-1 rounded">{user.voicePart}</span>
              </p>
              {user.phone && (
                <p className="text-base text-gray-600">
                  Member phone: <span className="font-medium">{user.phone}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-red-600">No member assigned.</p>
      )}

      {meta?.totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: meta.totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded border ${
                meta.currentPage === i + 1 ? "bg-blue-600 text-white" : ""
              }`}
              disabled={loading}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
