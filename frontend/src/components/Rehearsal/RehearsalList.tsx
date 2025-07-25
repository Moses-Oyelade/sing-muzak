// components/Rehearsal/RehearsalList.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import RehearsalForm from "./RehearsalForm";
import { deleteRehearsal } from "@/app/api/rehearsals";
import toast from "react-hot-toast";

interface Props {
  rehearsals: any[];
}

const RehearsalList = ({ rehearsals }: Props) => {
  const [selectedRehearsal, setSelectedRehearsal] = useState<any | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      if (!selectedRehearsal) return;
      await deleteRehearsal(selectedRehearsal._id);
      toast.success("Rehearsal deleted successfully");
      setDeleteModalOpen(false);
      window.location.reload();
    } catch (err) {
      toast.error("Failed to delete rehearsal");
    }
  };

  if (!rehearsals?.length) {
    return <p className="text-gray-500">No rehearsals available.</p>;
  }

  return (
    <>
      <div className="space-y-4">
        {rehearsals.map((rehearsal) => (
          <div
            key={rehearsal._id}
            className="border rounded shadow p-4 bg-white space-y-2"
          >
            <div>
              <h3 className="font-semibold text-lg">{rehearsal.title}</h3>
              <p className="text-sm text-gray-600">
                {dayjs(rehearsal.date).format("dddd, MMM D, YYYY")} at {rehearsal.time}
              </p>
              <p className="text-sm text-gray-700">Location: {rehearsal.location}</p>
            </div>

            <div className="flex gap-4 pt-2 text-sm">
              <Link
                href={`/dashboard/admin/rehearsals/${rehearsal._id}/details`}
                className="text-blue-600 hover:underline"
              >
                Manage
              </Link>
              <button
                onClick={() => {
                  setSelectedRehearsal(rehearsal);
                  setEditModalOpen(true);
                }}
                className="text-green-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setSelectedRehearsal(rehearsal);
                  setDeleteModalOpen(true);
                }}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Rehearsal"
        message="Are you sure you want to delete this rehearsal?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />

      {isEditModalOpen && selectedRehearsal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-lg">
            <RehearsalForm
              editMode
              rehearsal={selectedRehearsal}
              onClose={() => {
                setEditModalOpen(false);
                setSelectedRehearsal(null);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default RehearsalList;
