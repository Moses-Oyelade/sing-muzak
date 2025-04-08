// app/auth/logout/page.tsx

"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const LogoutPage = () => {
  const router = useRouter();

  const handleLogout = () => {
    signOut({ callbackUrl: "/" }); // Redirect to home after logging out
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white py-2 px-6 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default LogoutPage;
