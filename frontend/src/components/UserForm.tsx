"use client";

import axiosInstance from '@/utils/axios';
import { useEffect, useState } from 'react';
import { Toast } from 'react-hot-toast';
import router from 'next/router';

export default function UserForm() {
    const [formData, setFormData] = useState({
        name: '',
        email:'',
        phone: '',
        password: '',
        vocalPart: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(Prev => ({ ...Prev, 
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try{
            await axiosInstance.post('/users/createUser', formData);
            setMessage("User created successfully!");
            router.push("/dashboard/admin")
        } catch (error: any) {
            console.error(error)
            setMessage(error.response?.data?.message || 'something went wrong');
        } finally {
            setLoading(false);
        }
    };


  return (
    <div className='max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10'>
        <h2 className='text-2xl font-bold mb-4'>Add User</h2>
        <form onSubmit={handleSubmit} className='space-y-4' >
            <input 
                type="text"
                name='name'
                placeholder='full-name'
                className='w-full p-2 border rounded'
                value={formData.name}
                onChange={handleChange}
                required 
            />
            <input 
                type="email"
                name='email'
                placeholder='email'
                className='w-full p-2 border rounded'
                value={formData.email}
                onChange={handleChange}
            />
            <input
                type='text'
                name='phone'
                placeholder="phone" 
                className='w-full p-2 border rounded'
                value={formData.phone}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name='password'
                placeholder='password' 
                className='w-full p-2 border rounded'
                value={formData.password}
                onChange={handleChange}
                required
            />
            <select
                name="vocalPart"
                className='w-full p-2 boader rounded'
                value={formData.vocalPart}
                onChange={handleChange}
            >
                <option value="">Select Vocal Part</option>
                <option value="soprano">Soprano</option>
                <option value='alto'>Alto</option>
                <option value='tenor' >Tenor</option>
                <option value='bass'>Bass</option>
            </select>
            <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                disabled={loading}
            >
                {loading ? "Registering..." : "Register"}
            </button>
        </form>
        {message && <p 
            className='mt-4 text-center text-sm text-gray-600'
            >
              {message}
            </p>}
    </div>
  );
}
