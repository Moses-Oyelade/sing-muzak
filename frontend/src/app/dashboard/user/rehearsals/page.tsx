"use client";

import { useEffect, useState } from "react";
import { getRehearsals } from "@/app/api/rehearsals";
import MarkAttendance from "@/components/Rehearsal/MarkAttendance";
import RehearsalList from "@/components/Rehearsal/RehearsalList";
import toast from "react-hot-toast";

const MemberRehearsalsPage = () => {
  const [rehearsals, setRehearsals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRehearsalId, setSelectedRehearsalId] = useState("");

  useEffect(() => {
    const fetchRehearsals = async () => {
      setLoading(true);
      try {
        const data = await getRehearsals();
        setRehearsals(data.data);
      } catch {
        toast.error("Failed to load rehearsals");
      } finally {
        setLoading(false);
      }
    };

    fetchRehearsals();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold">My Rehearsals</h1>

      {/* <RehearsalList rehearsals={rehearsals} /> */}

      <div className="mt-8">
        <label className="block mb-2 font-bold text-xl">Select Rehearsal to Mark Attendance</label>
        <select
          className="border p-2 rounded w-full max-w-md"
          value={selectedRehearsalId}
          onChange={(e) => setSelectedRehearsalId(e.target.value)}
        >
          <option value="">-- Select Rehearsal --</option>
          {rehearsals.map((r) => (
            <option 
              key={r._id} 
              value={r._id}
              className="text-lg font-semibold"
              >
              {r.title.slice(0, 21)} - {new Date(r.date).toLocaleDateString()} at {r.time}
            </option>
          ))}
        </select>
        

        {selectedRehearsalId && (
          <div className="mt-4">
            <MarkAttendance rehearsalId={selectedRehearsalId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberRehearsalsPage;
