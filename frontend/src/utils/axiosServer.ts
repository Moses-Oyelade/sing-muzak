// utils/axiosServer.ts
import axios, { AxiosInstance } from 'axios';

export default function createAxiosWithAuth(token: string): AxiosInstance {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
