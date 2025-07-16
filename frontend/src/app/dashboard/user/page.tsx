
// dashboard/user/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import MemberCard from "@/components/MemberCard";
// import axiosInstance from "@/utils/axios";


export default async function MemberPage( ) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.token) {
    redirect("/auth/login");
  }

    return (
      <div className="max-w-5xl mx-auto p-2"><MemberCard />
      </div>
    )
}


