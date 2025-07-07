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

const socket = io("http://localhost:3000");

export default function UserCard({ users: initialUsers, meta: initialMeta } : { users: any[]; meta: any }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [meta, setMeta] = useState(initialMeta);
    // const [statusFilter, StatusFilter] = useState("")
    const [loading, setLoading] = useState(false);
    const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
    const [isToggle, setIsToggle] = useState(null);



    // declaration of params(psuedo routing)
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
    }, [search, voicePart, role, page])

    const updateUserVoicePart = async (userId: string, newVoicePart: string) => {
      
        const confirmAction =
          users.filter((user) =>
            userId === user._id ?
            window.confirm(`You are changing ${user.name} to ${newVoicePart.toUpperCase()} vocal part`) : undefined
          ) 

        if (!confirmAction) return; // If cancels, do nothing

        setUpdatingUserId(userId);

        try {
            await axiosInstance.patch(`/users/${userId}`, {
                voicePart: newVoicePart,
            });
            users.filter((user) => 
              userId === user._id ?
              toast.success(`${user.name} changed to ${newVoicePart.toUpperCase()} vocal part successfully`) : undefined
            )
            
            getUsers();
        } catch (err: any){
            toast.error(err?.response?.data?.message || "Failed to update voice Part.");
        } finally {
            setUpdatingUserId(null); //Stop loading
        }
    };

    useEffect(() => {
        socket.on("new_user", (newUser) => {
          toast.success(`🎶 New member: ${newUser.name} added`);
          setUsers((prev) => [newUser, ...prev]);
        });
    
        socket.on("voicePart_update", ({ userId, voicePart }) => {
          users.filter((user) =>
            userId === user._id ?
            toast.success(
              `✅ ${user.name} voice-part updated to ${voicePart}`
            ) : undefined
          );
          setUsers((prev) =>
            prev.map((user) => (user._id === userId ? { ...user, voicePart } : user))
          );
        });
    
        socket.on("user_removed", ({ userId }) => {
          setUsers((prev) => prev.filter((user) => user._id !== userId));
        });
    
        return () => {
          socket.off("new_user");
          socket.off("vocalPart_update");
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
        router.push(`/dashboard/admin/Members?search=${search}&voicePart=${voicePart}&role=${role}&page=${newPage}`);
      };

    // Toggle & hidden/display control 
    function handleClick(userId: any){
        setIsToggle((prevId) => (prevId === userId ? null: userId))
    }
    const edit = isToggle ? "Save" : "Edit"
    

  return (
    <div>
      {/* Search + Filters */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by title..."
          defaultValue={search}
          onChange={(e) => router.push(`/dashboard/admin/members?search=${e.target.value}&voicePart=${voicePart}&page=1`)}
          className="border px-3 py-2 rounded w-full max-w-sm"
        />
        <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded">
          Search
        </button>
        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <select
            className="border p-2"
            value={voicePart}
            onChange={(e) => {
              handleVocalPartChange(e.target.value);
            }}
          >
            <option value="">Select Role</option>
            {VOCALPART.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
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
                <p  className="text-base">
                  Voice-part:{" "}
                  <span className="uppercase text-base bg-gray-200 px-2 py-1 rounded">{user.voicePart}</span>
                  <span><button 
                    onClick={() => handleClick(user._id)}
                    className={isToggle === user._id ? (`text-white px-3 py-1 rounded
                          ${ edit === user._id ? "bg-green-300"
                          : "bg-green-500 hover:bg-green-300"}`
                        ) : (
                          `text-black px-3 py-1 rounded
                          ${ edit === user._id ? "bg-red-300"
                          : "bg-red-500 hover:bg-red-300"}`)} 
                    >
                      {isToggle === user._id ? "Save" : "Edit"}
                  </button></span>
                </p>
                {user.phone && (
                  <p className="text-base text-gray-600">
                    Member phone: <span className="font-medium">{user.phone || "unknown"}</span>
                  </p>
                )}
                {user.email && (
                  <p className="text-base text-gray-600">
                    Member email: <span className="font-medium">{user.email || "unknown"}</span>
                  </p>
                )}
                {user && (
                  <p className="text-sm text-gray-600">
                    Updated at:{" "}
                    <span className="font-medium">
                      {dayjs(user.updatedAt).fromNow()}
                    </span>
                  </p>
                )}

                {/* Actions */}
                <div className={isToggle === user._id ? "mt-3 flex gap-2" : "hidden"}>
                <button
                  className={`text-white px-3 py-1 rounded
                    ${ updatingUserId === user._id ? "bg-purple-300"
                    : "bg-purple-500 hover:bg-purple-300"
                  }`}
                  disabled={updatingUserId === user._Id}
                  onClick={() => updateUserVoicePart(user._id, "soprano")}
                >
                  {updatingUserId === user._Id ? "updating..." : "soprano"}
                </button>
                <button
                  className={`text-black px-3 py-1 rounded
                    ${ updatingUserId === user._id ? "bg-cyan-200"
                    : "bg-cyan-400 hover:bg-cyan-200"
                  }`}
                  disabled={updatingUserId === user._Id}
                  onClick={() => updateUserVoicePart(user._id, "alto")}
                >
                  {updatingUserId === user._Id ? "updating..." : "alto"}
                </button>
                <button
                  className={`text-white px-3 py-1 rounded
                    ${ updatingUserId === user._id ? "bg-purple-300"
                    : "bg-purple-500 hover:bg-purple-300"
                  }`}
                  disabled={updatingUserId === user._Id}
                  onClick={() => updateUserVoicePart(user._id, "tenor")}
                >
                  {updatingUserId === user._Id ? "updating..." : "tenor"}
                </button>
                <button
                  className={`text-black px-3 py-1 rounded
                    ${ updatingUserId === user._id ? "bg-cyan-200"
                    : "bg-cyan-400 hover:bg-cyan-200"
                  }`}
                  disabled={updatingUserId === user._Id}
                  onClick={() => updateUserVoicePart(user._id, "bass")}
                >
                  {updatingUserId === user._Id ? "updating..." : "bass"}
                </button>
              </div>
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
  )
}
