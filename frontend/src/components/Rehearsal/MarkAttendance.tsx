import { useState } from 'react';
import { markAttendance } from '@/app/api/rehearsals';
import toast from 'react-hot-toast';

const MarkAttendance = ({ rehearsalId }: { rehearsalId: string }) => {
  const [loading, setLoading] = useState(false);
  const [marked, setMarked] = useState(false);

  const handleMark = async () => {
    setLoading(true);
    try {
      await markAttendance(rehearsalId);
      toast.success('Attendance marked!');
      setMarked(true);
    } catch (err) {
      toast.error('Failed to mark attendance.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleMark}
      disabled={loading || marked}
      className={`bg-slate-400 p-2 rounded hover:bg-slate-300 btn ${marked ? 'btn-disabled' : 'btn-primary'}`}
    >
      {marked ? 'Already Marked' : loading ? 'Marking...' : 'Mark Attendance'}
    </button>
  );
};

export default MarkAttendance;
