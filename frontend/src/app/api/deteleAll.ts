// utils/api/deleteAll.ts

import axiosInstance from "@/utils/axios";

export const deleteAllNotifications = () => axiosInstance.delete("/notifications/all");
export const deleteAllRehearsals = () => axiosInstance.delete("/rehearsals/all");
export const deleteAllAnnouncements = () => axiosInstance.delete("/announcements/all");

