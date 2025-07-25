"use client";

import React from "react";

export interface TrendData {
  date: string;
  totalAttendees: number;
}

interface TrendsPanelProps {
  stats: TrendData[];
}

const TrendsPanel: React.FC<TrendsPanelProps> = ({ stats }) => {
  if (!stats.length) {
    return (
      <div className="text-center text-gray-500 italic mt-8">
        No attendance data available for selected date range.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow bg-white">
      <table className="min-w-full text-sm md:text-base text-left text-gray-700">
        <thead className="bg-gray-100 border-b border-gray-300">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Total Present</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((item, idx) => (
            <tr
              key={idx}
              className="border-b border-gray-200 hover:bg-gray-50 transition"
            >
              <td className="px-6 py-2 ">{new Date(item.date).toLocaleDateString()}</td>
              <td className="px-6 py-2 font-bold">{item.totalAttendees}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrendsPanel;
