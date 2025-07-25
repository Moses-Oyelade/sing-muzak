// utils/api/deleteAll.ts

import axiosInstance from "@/utils/axios";

export const deleteAllNotifications = () => axiosInstance.delete("/notifications");
export const deleteAllRehearsals = () => axiosInstance.delete("/rehearsals");
export const deleteAllAnnouncements = () => axiosInstance.delete("/announcements");

