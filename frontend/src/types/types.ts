// utils/types.ts

// Represents a user/member in the system
export type UserType = {
  _id: string;
  name: string;
  voicePart: "soprano" | "alto" | "tenor" | "bass" | "All";
  role?: "member" | "admin"; // Optional, if roles exist
};

// Represents a rehearsal event
export type RehearsalType = {
  _id: string;
  title: string;
  date: string; // ISO string
  time?: string; // Optional time
  location?: string;
  description?: string;
  attendees: string[]; // Array of user IDs
  createdBy?: string; // User ID
};

// Used for attendance stats (if applicable)
export type AttendanceStatsType = {
  total: number;
  present: number;
  absent: number;
};

// Generic API response shape
export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};
