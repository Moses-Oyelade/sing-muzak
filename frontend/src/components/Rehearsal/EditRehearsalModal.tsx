"use client";

import { useState } from "react";
import { updateRehearsal } from "@/app/api/rehearsals";
import toast from "react-hot-toast";

interface EditRehearsalModalProps {
  rehearsal: {
    _id: string;
    title?: string;
    date: string;
    time: string;
    location: string;
    description: string;
  };
  onClose: () => void;
  onUpdated: () => void; // callback to refresh parent data
}

const EditRehearsalModal = ({ rehearsal, onClose, onUpdated }: EditRehearsalModalProps) => {
  const [formData, setFormData] = useState({
    title: rehearsal.title || "",
    date: rehearsal.date?.substring(0, 10),
    time: rehearsal.time,
    location: rehearsal.location,
    description: rehearsal.description,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateRehearsal(rehearsal._id, formData);
      toast.success("Rehearsal updated");
      onUpdated();
      onClose();
    } catch (error) {
      toast.error("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-4">Edit Rehearsal</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full border px-3 py-2 rounded"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="description"
            className="w-full border px-3 py-2 rounded"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRehearsalModal;
