// app/dashboard/admin/members/page.tsx
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AddMemberButton from "@/components/AddMemberButton";
import UserCard from "@/components/UserCard";
import createAxiosWithAuth from "@/utils/axiosServer";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface AdminPageProps {
  searchParams: {
    voicePart?: string;
    search?: string;
    role?: string;
    page?: string;
  };
}

export default async function MembersPage({ searchParams }: AdminPageProps) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.token) {
    redirect("/auth/login");
  }

  const axios = createAxiosWithAuth(session.user.token);
  if (!axios) {
    return <div className="p-4 text-red-600">Axios not configured</div>;
  }

  const { voicePart = "All", role = "All", search = "", page = "1" } = searchParams;

  try {
    const res = await axios.get("/users/filter", {
      params: {
        voicePart: voicePart !== "All" ? voicePart : undefined,
        role: role !== "All" ? role : undefined,
        search,
        page,
      },
    });

    const { data: users, meta } = res.data;

    return (
      <div className="max-w-5xl mx-auto p-4 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Member List</h2>
          <AddMemberButton /> 
      </div>
        <UserCard users={users || []} meta={meta || {}} />
      </div>
    );
  } catch (err) {
    console.error("❌ Failed to fetch users:", err);
    return <p className="text-red-600">Failed to load users.</p>;
  }
}
