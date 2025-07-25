"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getRehearsalById,
  getAttendanceStats,
} from "@/app/api/rehearsals";
import { getAllMembers } from "@/app/api/rehearsals"; 
import AttendanceManagerPanel from "@/components/Rehearsal/AttendanceManagerPanel";
import AttendanceSummaryPanel from "@/components/Rehearsal/AttendanceSummaryPanel";
import toast from "react-hot-toast";
import dayjs from "dayjs";

const AdminRehearsalDetails = () => {
  const params = useParams();
  const id = params.id;

  const [rehearsal, setRehearsal] = useState<any>(null);
  const [attendanceStats, setAttendanceStats] = useState<{
    rehearsalId: string;
    totalMembers: number;
    present: number;
    absent: number;
  } | null>(null);

  const [attendees, setAttendees] = useState<any[]>([]); // ✅ Fix: add members state

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id || typeof id !== "string") {
        toast.error("Invalid rehearsal ID.");
        return;
      }
      

      try {
        const [rehearsalData, stats, userData] = await Promise.all([
          getRehearsalById(id),
          getAttendanceStats(id),
          getAllMembers(), // Call API to get users
        ]);

        console.log("Rehearsal ID:", id);
        console.log("Rehearsal attendees:", userData);
        console.log("Rehearsal Data:", rehearsalData);
        setRehearsal(rehearsalData);
        setAttendanceStats(stats);
        setAttendees(userData); // Store users in state
      } catch (err) {
        console.error("Error loading rehearsal details:", err);
        toast.error("Failed to load rehearsal details.");
      }
    };

    if (id) fetchDetails();
  }, [id]);

  if (!rehearsal) return <p>Loading rehearsal...</p>;
  if (!attendanceStats) return <p>Loading stats...</p>;

  return (
    <div className="p-6 space-y-8">
      <div className="bg-white shadow rounded-md p-4 space-y-2">
        <h1 className="text-xl font-semibold">{rehearsal.location}</h1>
        <p>
          {dayjs(rehearsal.date).format("MMM D, YYYY")} at {rehearsal.time}
        </p>
        <p className="text-gray-600">{rehearsal.description}</p>
      </div>

      
      <AttendanceManagerPanel 
        rehearsalId={id as string} 
        attendees={attendees} 
        onUpdateStats={async () => {
          try {
            const stats = await getAttendanceStats(id as string);
            setAttendanceStats(stats);
          } catch {
            toast.error("Could not refresh stats");
          }
        }}
      />
      <AttendanceSummaryPanel stats={attendanceStats} />
    </div>
  );
};

export default AdminRehearsalDetails;
