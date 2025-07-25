// components/AddMemberButton.tsx
"use client";

import { useRouter } from "next/navigation";

export default function AddMemberButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/dashboard/admin/users")}
      className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Add Member
    </button>
  );
}
