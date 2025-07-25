"use client";
import { useState } from "react";

export default function MemberModal({ member }: { member: any }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>{member.name}</button>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-md w-96">
            <h2 className="text-xl font-semibold">{member.name}</h2>
            <p>Email: {member.email}</p>
            <p>Voice Part: {member.voicePart}</p>
            <button onClick={() => setOpen(false)} className="mt-4 text-red-500">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
