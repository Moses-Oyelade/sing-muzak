"use client";

import { useState } from "react";
import { scheduleRehearsal, updateRehearsal } from "@/app/api/rehearsals";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

interface RehearsalFormProps {
  rehearsal?: any;
  editMode?: boolean;
  onSuccess?: () => void;
  onClose?: () => void;
}

const RehearsalForm = ({
  rehearsal,
  editMode = false,
  onSuccess,
  onClose,
}: RehearsalFormProps) => {
  const { data: session } = useSession();
  const userId = session?.user?.id || "";

  const [title, setTitle] = useState(rehearsal?.title || "");
  const [date, setDate] = useState(rehearsal?.date?.slice(0, 10) || "");
  const [time, setTime] = useState(rehearsal?.time || "");
  const [location, setLocation] = useState(rehearsal?.location || "");
  const [description, setDescription] = useState(rehearsal?.description || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    

    try {
      if (!userId || session?.user?.role !== "admin") {
        toast.error("Only admins can schedule rehearsals.");
        return;
      }
      const payload = { 
        title, 
        date, 
        time, 
        location, 
        description, 
        createdBy: userId
      };

      if (editMode && rehearsal?._id) {
        await updateRehearsal(rehearsal._id, payload);
        toast.success("Rehearsal updated");
      } else {
        await scheduleRehearsal(payload);
        toast.success("Rehearsal created");
      }

      onSuccess?.();
      onClose?.();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Time</label>
          <input
            type="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          required
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description (optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      <div className="flex items-center justify-end gap-3">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {isSubmitting
            ? editMode
              ? "Updating..."
              : "Creating..."
            : editMode
            ? "Update Rehearsal"
            : "Create Rehearsal"}
        </button>
      </div>
    </form>
  );
};

export default RehearsalForm;
