// app/dashboard/page.tsx

"use client";

// import { getServerSession } from "next-auth";
// import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import DashboardContent from "./DashboardContent";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  // const session = await getServerSession(authOptions);
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (!session) redirect("/auth/login");

  return <DashboardContent />;
}


