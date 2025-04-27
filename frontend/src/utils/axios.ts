// utils/axios.ts

import axios from 'axios';
import { getSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
    // withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession(); // from next-auth/react only on the client

    if (typeof window !== 'undefined') {
      console.log('Token attached (window defined)')
    } else {
      console.warn("🚨 Server Axios: Not attaching token (window is undefined)");
      return config;
    }

    if (!session) {
      redirect("/auth/login");
    }
    
    
    const token = session?.user?.token;
    console.log('🚀 Axios Interceptor Token:', session?.user?.token);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("🚀 Axios Interceptor: Set Authorization Header");
    } else {
        console.warn("🚨 Axios Interceptor: No token found!");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
