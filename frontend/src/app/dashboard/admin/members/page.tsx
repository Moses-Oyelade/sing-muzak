// dashboard/admin/members/page.tsx
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import UserForm from "@/components/UserForm";
import createAxiosWithAuth from "@/utils/axiosServer";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


interface AdminPageProps {
    searchParams: {
      vocalPart?: string;
      search?: string;
      role?: string;
      page?: string;
    };
  }

export default async function MemberPage({ searchParams }: AdminPageProps) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.token) {
        redirect("/auth/login");
    }

    const axios = createAxiosWithAuth(session.user.token);
    if (!axios) {
        return <div className="p-4 text-red-600">Axios not configured</div>;
    }

    const resolvedSearchParams = searchParams;

    const page = typeof resolvedSearchParams.page === "string" ? resolvedSearchParams.page : "1";
    const search = typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : "";
    const vocalPart = typeof resolvedSearchParams.vocalPart === "string" ? resolvedSearchParams.vocalPart : "All";
    const role = typeof resolvedSearchParams.role === "string" ? resolvedSearchParams.role : "All";

    try {
      const res = await axios.get(`/users/filter?vocalPart=${vocalPart}&search=${search}&role=${role}&page=${page}`);
      
      const { data: users, meta } = res.data;

      return (
        <div className="max-w-5xl mx-auto p-2">
          <UserForm users={users || []} meta={meta || {}} />
        </div>
      )
    } catch (err) {
      console.error("❌ Failed to fetch admin songs:", err);
      return <p className="text-red-600">Failed to load users.</p>;
    }
}
