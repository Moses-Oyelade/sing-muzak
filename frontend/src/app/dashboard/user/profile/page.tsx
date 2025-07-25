"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
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

const ProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/users/profile");
      setProfile(res.data.user._id);
      setFormData(res.data.user);
    } catch (err: any) {
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if(!formData) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.patch(`/users/${profile}`, formData);
      toast.success("Profile updated successfully");
      setProfile(res.data);
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 rounded shadow bg-white">
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>

      {profile.profileImage && (
        <img
          src={profile.profileImage}
          alt="Profile"
          className="w-24 h-24 rounded-full mb-4 object-cover"
        />
      )}

      <div className="grid grid-cols-1 gap-4">
        {["name", "email", "gender", "instrument", "address", "voicePart", "profileImage"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium capitalize">{field}</label>
            <input
              type="text"
              name={field}
              value={(formData as any)[field] || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              disabled={!isEditing}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-6">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit
          </button>
        ) : (
          <>
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData(profile); // revert
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
