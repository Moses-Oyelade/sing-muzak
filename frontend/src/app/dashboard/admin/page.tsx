
// dashboard/admin/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AdminDashboard from "@/components/AdminDashboard";
import createAxiosWithAuth from "@/utils/axiosServer";
import { redirect } from "next/navigation";
// import axiosInstance from "@/utils/axios";


interface AdminPageProps {
  searchParams: {
    status?: string;
    search?: string;
    category?: string;
    page?: string;
  };
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
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
  const status = typeof resolvedSearchParams.status === "string" ? resolvedSearchParams.status : "All";
  const category = typeof resolvedSearchParams.category === "string" ? resolvedSearchParams.category : "All";


  try {
    const res = await axios.get(`/songs/filter?status=${status}&search=${search}&category${category}&page=${page}`);
    
    const { data: songs, meta } = res.data;

    return (
      <div className="max-w-5xl mx-auto p-2">
        {/* <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1> */}
        <AdminDashboard songs={songs || []} meta={meta || {}} />
      </div>
    );
  } catch (err) {
    console.error("❌ Failed to fetch admin songs:", err);
    return <p className="text-red-600">Failed to load songs.</p>;
  }
}


