// app/dashboard/admin/rehearsals/page.tsx or wherever this file is
"use client";

import { useEffect, useState } from "react";
import { getRehearsals } from "@/app/api/rehearsals";
import RehearsalList from "@/components/Rehearsal/RehearsalList";
import RehearsalForm from "@/components/Rehearsal/RehearsalForm";
import toast from "react-hot-toast";

const AdminRehearsalDashboard = () => {
  const [rehearsals, setRehearsals] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchData = async () => {
    try {
      const data = await getRehearsals();
      setRehearsals(data.data);
    } catch (error) {
      toast.error("Failed to fetch rehearsals");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFormSubmitSuccess = () => {
    setShowForm(false);
    fetchData(); // refresh list
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-semibold">Rehearsals Management</h1>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {showForm ? "Close Form" : "Create Rehearsal"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white shadow rounded-md p-4 sm:p-6">
          <RehearsalForm onSuccess={handleFormSubmitSuccess} />
        </div>
      )}

      <div className="bg-white shadow rounded-md p-4 sm:p-6">
        <RehearsalList rehearsals={rehearsals} />
      </div>
    </div>
  );
};

export default AdminRehearsalDashboard;
