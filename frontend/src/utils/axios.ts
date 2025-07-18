// utils/axios.ts
import axios from 'axios';
import { getSession } from 'next-auth/react';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    if (typeof window === 'undefined') {
      console.warn("🚨 Server Axios: Not attaching token (window is undefined)");
      return config;
    }

    const session = await getSession();

    if (!session) {
      console.warn("No session, redirecting to login...");
      window.location.href = "/auth/login";
      return Promise.reject(new Error("Not authenticated"));
    }

    const token = session?.user?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🚀 Axios Interceptor: Token attached");
    } else {
      console.warn("🚨 Axios Interceptor: No token found!");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("🔒 Session expired or unauthorized. Redirecting to login...");
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
