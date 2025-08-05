"use client";

import { useEffect, useState } from "react";
import { adminMarkAttendance, removeAttendance, getRehearsalById } from "@/app/api/rehearsals";
import { UserType } from "@/types/types";
import toast from "react-hot-toast";

type Props = {
  rehearsalId: string;
  attendees: UserType[];
  onUpdateStats: () => void;
};

export default function AttendanceManagerPanel({
  rehearsalId,
  attendees,
  onUpdateStats,
}: Props) {
  const [marked, setMarked] = useState<string[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔄 Fetch rehearsal attendees from backend once on mount
  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const data = await getRehearsalById(rehearsalId);
      
        setMarked(data?.attendees?.map((user: UserType) => user.role === 'member' ? user._id : '') || []);
      } catch (err) {
        console.error("Failed to fetch attendees:", err);
        toast.error("Could not load existing attendance.");
      }
    };

    fetchAttendees();
  }, [rehearsalId, attendees]);

  const toggleMarked = (id: string) => {
    if (marked.includes(id)) {
      setMarked((prev) => prev.filter((x) => x !== id));
    } else {
      setMarked((prev) => [...prev, id]);
    }
  };

  const handleMarkAttendance = async () => {
    if (marked.length === 0) {
      toast.error("No members selected");
      return;
    }

    try {
      setLoading(true);
      await adminMarkAttendance(rehearsalId, marked);
      toast.success("Attendance marked");
      onUpdateStats();
    } catch (err: any) {
      toast.error("Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAll = async () => {
    if (marked.length === 0) {
      toast.error("No attendees to remove");
      return;
    }

    try {
      setLoading(true);
      await removeAttendance(rehearsalId, marked);
      toast.success("Attendance removed");
      setMarked([]);
      onUpdateStats();
    } catch (err: any) {
      toast.error("Failed to remove attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Attendance</h2>
        <button
          className="text-sm text-blue-600 hover:underline"
          onClick={() => setEditMode((prev) => !prev)}
        >
          {editMode ? "View Attendees" : "Edit Attendance"}
        </button>
      </div>

      {editMode ? (
        <>
          <div className="max-h-80 overflow-y-auto">
            {attendees.map((attendee) => (
              <label
                key={attendee._id}
                className="flex items-center gap-2 py-1 border-b"
              >
                <input
                  type="checkbox"
                  checked={marked.includes(attendee._id)}
                  onChange={() => toggleMarked(attendee._id)}
                />
                <span>{attendee.name} ({attendee.voicePart})</span>
              </label>
            ))}
          </div>

          <div className="flex gap-4 mt-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              disabled={loading}
              onClick={handleMarkAttendance}
            >
              {loading ? "Marking..." : "Update Attendance"}
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              disabled={loading}
              onClick={handleRemoveAll}
            >
              {loading ? "Removing..." : "Remove Attendees"}
            </button>
          </div>
        </>
      ) : (
        <div className="max-h-60 overflow-y-auto space-y-1">
          {attendees
            .filter((m) => marked.includes(m._id))
            .map((member) => (
              <div key={member._id} className="border-b py-1">
                {member.name} ({member.voicePart})
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
