"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";

interface User {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  voicePart?: string;
  profileImage?: string;
}

export default function MemberCard() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = session?.user?.id


  const fetchUsersByVocalPart = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      // Step 1: Get current user profile to find their vocalPart
      const meRes = await axiosInstance.get(`/users/${userId}`);
      const currentUser: User = meRes.data;
      console.log(currentUser.voicePart)

      if (!currentUser.voicePart) {
        console.warn("You currently do not have a vocal part set.");
        setUsers([]);
        return;
      }

      // Step 2: Fetch users with the same vocalPart
      const res = await axiosInstance.get(`/users/filter?voicePart=${currentUser.voicePart}`);
      const data = res.data?.data || res.data;
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersByVocalPart();
  }, [session]);

  if (loading) return <p className="text-center">Loading members...</p>;

  if (!users.length) return <p className="text-center text-red-600">No members found in your vocal part.</p>;

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
      {users.map((user) => (
        <div key={user._id} className="border p-4 rounded shadow bg-white">
          {user.profileImage ? (
            <img src={user.profileImage} alt={user.name} className="w-16 h-16 rounded-full mx-auto mb-2" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-300 mx-auto mb-2 flex items-center justify-center text-xl font-bold">
              🎙 {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <h3 className="text-lg font-semibold text-center">{user.name}</h3>
          <p className="text-sm text-center text-gray-600">{user.email || "No email"}</p>
          <p className="text-sm text-center text-gray-600">{user.phone || "No phone"}</p>
          <p className="text-xs text-center text-blue-600 font-semibold mt-2">🎵 {user.voicePart}</p>
        </div>
      ))}
    </div>
  );
}
