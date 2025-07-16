// app/dashboard/page.tsx

"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import DashboardContent from "@/components/DashboardContent";
import NavBar from "@/components/NavBar";

export default function DashboardPage() {
  // const session = await getServerSession(authOptions);
  const { data: session, status } = useSession();

  const token = session?.user?.token;
  const role = session?.user?.role;
  // const memberInfo = session?.user;

  if (status === "loading") return <div>Loading...</div>;
  if (!session) redirect("/auth/login");

  const isAdmin = role === "admin";

  return (
    <>
    { isAdmin ? (
      <DashboardContent />
    ) : (
      <div>
        <NavBar />
        <DashboardContent />
      </div>

    )

    }
    </>
  );
}


