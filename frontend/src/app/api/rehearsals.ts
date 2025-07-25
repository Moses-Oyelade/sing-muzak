// app/api/rehearsals.ts
import axiosInstance from "@/utils/axios";


export const getRehearsals = () => axiosInstance.get("/rehearsals");

export const scheduleRehearsal = (data: {
  title: string;
  date: string;
  time: string;
  location: string;
  createdBy: string;
  description?: string;
}) => axiosInstance.post("/rehearsals", data);

export const markAttendance = (rehearsalId: string) =>
  axiosInstance.patch(`/rehearsals/${rehearsalId}/attendance`, { });

export const adminMarkAttendance = (rehearsalId: string, attendees: string[] | string) =>
  axiosInstance.patch(`/rehearsals/${rehearsalId}/attendance/admin`, { attendees });

export const removeAttendance = (rehearsalId: string, attendees: string[] | string) =>
  axiosInstance.patch(`/rehearsals/${rehearsalId}/attendance/admin/remove`, { attendees });

export const getAttendance = (rehearsalId: string) =>
  axiosInstance.get(`/rehearsals/${rehearsalId}/attendance`);

export const getReport = (rehearsalId: string) =>
  axiosInstance.get(`/rehearsals/${rehearsalId}/attendance/report`);

export const getReportByRange = (startDate: string, endDate: string) =>
  axiosInstance.get(`/rehearsals/attendance/report?startDate=${startDate}&endDate=${endDate}`);

export const getTrends = (startDate: string, endDate: string) =>
  axiosInstance.get(`/rehearsals/attendance/trends?startDate=${startDate}&endDate=${endDate}`);

export const exportCSV = (startDate: string, endDate: string) =>
  axiosInstance.get(`/rehearsals/attendance/export?startDate=${startDate}&endDate=${endDate}`, {
    responseType: "blob",
  });

export const getRehearsalById = async (rehearsalId: string) => {
  if (!rehearsalId) throw new Error("Missing rehearsalId");
  const res = await axiosInstance.get(`/rehearsals/${rehearsalId}`);
  console.log("✅ Rehearsal raw response fetched:", res);
  return res.data; // assuming the structure is { data: {...rehearsal} }
};

// Get attendance Statistics
export const getAttendanceStats = async (rehearsalId: string) => {
  const res = await axiosInstance.get(`/rehearsals/${rehearsalId}/attendance/stats`);
  return res.data; 
};

// Delete Rehearsal
export const deleteRehearsal = async (rehearsalId: string) => {
  const res = await axiosInstance.delete(`/rehearsals/${rehearsalId}`);
  return res.data;
};

// Update Rehearsal
export const updateRehearsal = async (
  rehearsalId: string,
  updateData: {
    title?: string;
    date?: string;
    time?: string;
    location?: string;
    description?: string;
  }
) => {
  const res = await axiosInstance.patch(`/rehearsals/${rehearsalId}`, updateData);
  return res.data.data; // Assuming API responds with { data: { ...updatedRehearsal } }
};

// Get all Members
export const getAllMembers = async () => {
  const res = await axiosInstance.get("/users");
  return res.data; // assuming it returns [{ _id, name }]
};


