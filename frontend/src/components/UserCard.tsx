"use client";

import axiosInstance from "@/utils/axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import dayjs from "@/lib/dayjs";
import toast from "react-hot-toast";

const VOCALPART = ["All", "soprano", "alto", "tenor", 'bass', "pending"];
const ROLE = ["All", "admin", "member"];

interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    profileImagine?: string;
    address: string;
    role: string;
    voicePart: string;
}

const socket = io(process.env.NEXT_PUBLIC_API_URL);

export default function UserCard({ users: initialUsers, meta: initialMeta } : { users: any[]; meta: any }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [users, setUsers] = useState<User[]>(initialUsers);
    const [meta, setMeta] = useState(initialMeta);
    const [loading, setLoading] = useState(false);
    const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
    const [isToggle, setIsToggle] = useState<string | null>(null);

    const search = searchParams.get("search") || "";
    const voicePart = searchParams.get("voicePart") || "All";
    const role = searchParams.get("role") || "All";
    const page = searchParams.get("page") || "1";

    const getUsers = async () => {
        try{
            setLoading(true);
            const res = await axiosInstance.get('/users/filter', {
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
        } catch (err){
            console.error('Error loading users:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        getUsers();
    }, [search, voicePart, role, page]);

    const updateUserVoicePart = async (userId: string, newVoicePart: string) => {
        setUpdatingUserId(userId);
        try {
            await axiosInstance.patch(`/users/${userId}`, {
                voicePart: newVoicePart,
            });
            toast.success(`User voice part updated to ${newVoicePart.toUpperCase()}`);
            getUsers();
        } catch (err: any){
            toast.error(err?.response?.data?.message || "Failed to update voice Part.");
        } finally {
            setUpdatingUserId(null);
        }
    };

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

    const handleSearch = () => {
        router.push(`/dashboard/admin/members?search=${search}&voicePart=${voicePart}&role=${role}&page=1`);
    };

    const handleVocalPartChange = (newVoicePart: string) => {
        router.push(`/dashboard/admin/members?search=${search}&voicePart=${newVoicePart}&role=${role}&page=1`);
    };

    const handleRoleChange = (newRole: string) => {
        router.push(`/dashboard/admin/members?search=${search}&voicePart=${voicePart}&role=${newRole}&page=1`);
    };

    const handlePageChange = (newPage: number) => {
        router.push(`/dashboard/admin/members?search=${search}&voicePart=${voicePart}&role=${role}&page=${newPage}`);
    };

    const handleClick = (userId: string) => {
        setIsToggle((prevId) => (prevId === userId ? null : userId));
    };

    return (
      <div>
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <input
            type="text"
            placeholder="Search by name..."
            defaultValue={search}
            onChange={(e) => router.push(`/dashboard/admin/members?search=${e.target.value}&voicePart=${voicePart}&page=1`)}
            className="border px-3 py-2 rounded w-full max-w-sm"
          />
          <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded">
            Search
          </button>
          <div className="flex gap-4 mb-4">
            <select
              className="border p-2"
              value={voicePart}
              onChange={(e) => handleVocalPartChange(e.target.value)}
            >
              <option value="">Select Vocal Part</option>
              {VOCALPART.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            {ROLE.map((s) => (
              <button
                key={s}
                onClick={() => handleRoleChange(s)}
                className={`px-3 py-1 rounded border ${s === role ? "bg-blue-600 text-white" : "bg-gray-100"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="space-y-4">
            {Array.isArray(users) && users.length > 0 ? (
              users.map((user: any) => (
                <div key={user._id} className="p-4 border rounded shadow-sm">
                  <h2 className="text-lg font-semibold">{user.name}</h2>
                  <div className="text-base flex items-center gap-3">
                    <span>Voice-part:</span>
                    <span className="uppercase text-base bg-gray-200 px-2 py-1 rounded">{user.voicePart}</span>
                    {isToggle === user._id ? (
                      <>
                        <select
                          className="border px-2 py-1 rounded"
                          value={user.voicePart}
                          onChange={(e) => updateUserVoicePart(user._id, e.target.value)}
                          disabled={updatingUserId === user._id}
                        >
                          <option value="">Select vocal part</option>
                          <option value="soprano">Soprano</option>
                          <option value="alto">Alto</option>
                          <option value="tenor">Tenor</option>
                          <option value="bass">Bass</option>
                          <option value="pending">Pending</option>
                        </select>
                        <button
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500 disabled:opacity-50"
                          onClick={() => setIsToggle(null)}
                          disabled={updatingUserId === user._id}
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleClick(user._id)}
                        className="text-black px-3 py-1 rounded bg-slate-400 hover:bg-slate-200"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  {user.phone && (
                    <p className="text-base text-gray-600">Member phone: <span className="font-medium">{user.phone}</span></p>
                  )}
                  {user.email && (
                    <p className="text-base text-gray-600">Member email: <span className="font-medium">{user.email}</span></p>
                  )}
                  <p className="text-sm text-gray-600">
                    Updated at: <span className="font-medium">{dayjs(user.updatedAt).fromNow()}</span>
                  </p>
                </div>
              ))
            ) : (
              <p className="text-red-600">No member assigned.</p>
            )}
          </div>
        )}

        {meta?.totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: meta.totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded border ${meta.currentPage === i + 1 ? "bg-blue-600 text-white" : ""}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    );
}
