"use client";

import axiosInstance from "@/utils/axios";
import { useEffect, useState } from 'react';
import toast from "react-hot-toast";

const VOCALPART = ["All", "soprano", "alto", "tenor", 'bass'];
const ROLE = ["admin", "member"];

interface User {
    name: string;
    email: string;
    phone: string;
    password: string;
    profileImagine?: string;
    address: string;
    role: string;
    voicePart: string;
}

export default function UserCard() {
    const [user, setUser] = useState<User[]>([]);
    const [statusFilter, StatusFilter] = useState("")
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

    const getUsers = async () => {

        try{
            const data = await axiosInstance.get('/users');
            setUser(Array.isArray(data.data.users) ? data.data.users: []);
            setTotalPages(data.data.totalPages || 1);
        } catch (err){
            console.error('Error loading users:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateUserVoicePart = async (userId: string, newVoicePart: string) => {
        const confirmAction = window.confirm(`You are changing user to ${newVoicePart.toUpperCase()} vocal part`)

        if (!confirmAction) return; // If cancels, do nothing

        setUpdatingUserId(userId);

        try {
            await axiosInstance.put(`/users/${userId}`, {
                voicePart: newVoicePart,
            });
            toast.success(`User moved to ${newVoicePart.toUpperCase()} vocal part successfully`)
            getUsers();
        } catch (err: any){
            toast.error(err?.response?.data?.message || "Failed to update voice Part.");
        } finally {
            setUpdatingUserId(null); //Stop loading
        }
    }

  return (
    <div>UserCard</div>
  )
}
