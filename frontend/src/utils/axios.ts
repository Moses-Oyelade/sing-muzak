// utils/axios.ts
import axios from 'axios';
import { getSession } from 'next-auth/react';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
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

export default axiosInstance;
