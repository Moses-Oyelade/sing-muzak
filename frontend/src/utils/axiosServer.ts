// utils/axiosServer.ts
import axios, { AxiosInstance } from 'axios';

export default function createAxiosWithAuth(token: string): AxiosInstance {
  return axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
