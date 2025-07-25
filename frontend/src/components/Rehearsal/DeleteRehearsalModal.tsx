"use client";

import { deleteRehearsal } from "@/app/api/rehearsals";
import toast from "react-hot-toast";

interface DeleteRehearsalModalProps {
  rehearsalId: string;
  onClose: () => void;
  onDeleted: () => void; // callback to refresh parent
}

const DeleteRehearsalModal = ({
  rehearsalId,
  onClose,
  onDeleted,
}: DeleteRehearsalModalProps) => {
  const handleDelete = async () => {
    try {
      await deleteRehearsal(rehearsalId);
      toast.success("Rehearsal deleted successfully");
      onDeleted();
      onClose();
    } catch (error) {
      toast.error("Failed to delete rehearsal");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">Delete Rehearsal</h2>
        <p className="mb-6 text-sm text-gray-700">
          Are you sure you want to delete this rehearsal? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteRehearsalModal;
