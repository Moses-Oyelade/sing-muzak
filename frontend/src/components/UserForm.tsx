"use client";

import axiosInstance from '@/utils/axios';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function UserForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    vocalPart: '',
    role: '',
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.post('/users/createUser', formData);
      toast.success('User created successfully!');
      router.push('/dashboard/admin/members');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || 'Something went wrong');
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 bg-white shadow-md rounded-lg mt-6 sm:mt-10">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">Add User</h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full p-2 border rounded"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          className="w-full p-2 border rounded"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select
          name="vocalPart"
          className="w-full p-2 border rounded"
          value={formData.vocalPart}
          onChange={handleChange}
        >
          <option value="">Select Vocal Part</option>
          <option value="soprano">Soprano</option>
          <option value="alto">Alto</option>
          <option value="tenor">Tenor</option>
          <option value="bass">Bass</option>
        </select>
        <select
          name="role"
          className="w-full p-2 border rounded"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="">Select Role</option>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>

        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 sm:items-center">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard/admin/members')}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
