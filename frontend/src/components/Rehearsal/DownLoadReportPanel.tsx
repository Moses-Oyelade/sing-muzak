"use client";

import { useState } from "react";
import axiosInstance from "@/utils/axios";
import toast from "react-hot-toast";

const DownloadReportPanel = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates.");
      return;
    }
    if (startDate > endDate) {
      toast.error("Start date cannot be after end date.");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.get("/rehearsals/attendance/export", {
        params: { startDate, endDate },
        responseType: "blob",
      });
      console.log("SCV file: ", response.data)
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `attendance_${startDate}_to_${endDate}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("CSV report downloaded successfully.");
    } catch (err) {
      toast.error("Failed to download report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Download Attendance Report
      </h2>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex flex-col w-full">
          <label
            htmlFor="startDate"
            className="text-sm font-medium text-gray-600 mb-1"
          >
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex flex-col w-full">
          <label
            htmlFor="endDate"
            className="text-sm font-medium text-gray-600 mb-1"
          >
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>
      <button
        onClick={handleDownload}
        disabled={loading}
        className={`w-full bg-green-600 text-white py-2 rounded-md font-semibold transition ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
        }`}
      >
        {loading ? "Preparing..." : "Download CSV"}
      </button>
    </div>
  );
};

export default DownloadReportPanel;
