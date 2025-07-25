interface AttendanceStats {
  rehearsalId: string;
  totalMembers: number;
  present: number;
  absent: number;
}

const AttendanceSummaryPanel = ({ stats }: { stats: AttendanceStats }) => {
  const { totalMembers, present, absent } = stats;
  const presentPercentage = ((present / totalMembers) * 100).toFixed(1);
  const absentPercentage = ((absent / totalMembers) * 100).toFixed(1);

  return (
    <div className="bg-white shadow rounded-md p-6">
      <h2 className="text-lg font-semibold mb-4">Attendance Summary</h2>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-green-100 text-green-800 rounded-md p-4">
          <p className="text-sm">Present</p>
          <p className="text-xl font-bold">{present}</p>
          <p className="text-xs">{presentPercentage}%</p>
        </div>
        <div className="bg-red-100 text-red-800 rounded-md p-4">
          <p className="text-sm">Absent</p>
          <p className="text-xl font-bold">{absent}</p>
          <p className="text-xs">{absentPercentage}%</p>
        </div>
        <div className="bg-blue-100 text-blue-800 rounded-md p-4">
          <p className="text-sm">Total Members</p>
          <p className="text-xl font-bold">{totalMembers}</p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSummaryPanel;
