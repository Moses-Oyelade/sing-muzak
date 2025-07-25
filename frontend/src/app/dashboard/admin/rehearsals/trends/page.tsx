"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import toast from "react-hot-toast";
import TrendsPanel, { TrendData } from "@/components/Rehearsal/TrendsPanel";
import DownloadReportPanel from "@/components/Rehearsal/DownLoadReportPanel";

const TrendsPage = () => {
  const [view, setView] = useState<"trend" | "report">("trend");
  const [stats, setStats] = useState<TrendData[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!startDate || !endDate) {
      setStats([]);
      return;
    }
    if (startDate > endDate) {
      toast.error("Start date cannot be after end date.");
      setStats([]);
      return;
    }

    const fetchTrends = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/rehearsals/attendance/trends", {
          params: { startDate, endDate },
        });
        setStats(response.data);
      } catch (error) {
        toast.error("Failed to fetch attendance trends.");
        setStats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [startDate, endDate]);

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header and toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Attendance Insights</h1>
        <button
          onClick={() => setView(view === "trend" ? "report" : "trend")}
          className={`px-5 py-2 rounded font-semibold text-white transition ${
            view === "trend"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {view === "trend" ? "Download Report" : "Back to Trends"}
        </button>
      </div>

      {/* Date inputs only for trend view */}
      {view === "trend" && (
        <div className="flex flex-col sm:flex-row gap-4 max-w-md">
          <div className="flex flex-col w-full">
            <label
              htmlFor="filterStartDate"
              className="text-sm font-medium text-gray-600 mb-1"
            >
              Start Date
            </label>
            <input
              id="filterStartDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col w-full">
            <label
              htmlFor="filterEndDate"
              className="text-sm font-medium text-gray-600 mb-1"
            >
              End Date
            </label>
            <input
              id="filterEndDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Content */}
      {view === "trend" ? (
        loading ? (
          <div className="text-center text-gray-600 mt-12 font-medium">
            Loading trends...
          </div>
        ) : stats.length > 0 ? (
          <TrendsPanel stats={stats} />
        ) : (
          <div className="text-center mt-12 text-gray-500">
            <p className="text-lg font-medium">No attendance trends available</p>
            <p className="text-sm">Try selecting a different date range above.</p>
          </div>
        )
      ) : (
        <DownloadReportPanel />
      )}
    </div>
  );
};

export default TrendsPage;
