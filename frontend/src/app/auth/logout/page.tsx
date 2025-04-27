// app/auth/logout/page.tsx

"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      await signOut({ redirect: false }); // Redirect to home after logging out
      router.push('/')
    };

    handleLogout();
  }, [router]);


  return <p>Logging out...</p>;
};

export default LogoutPage;
