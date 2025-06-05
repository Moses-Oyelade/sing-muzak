// app/dashboard/layout.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
// import SearchSongs from "./SearchSongs";
// import createAxiosWithAuth from "@/utils/axiosServer";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  // console.log("✅ Session.user.token:", session.user?.token);
  // const axios = await createAxiosWithAuth();

  // console.log("📦 Axios headers:", axios?.defaults.headers);
  // if (!axios || !session) return <p>Unauthorized</p>
  if (!session) return <p>Unauthorized</p>

  // const res = await axios.get("/users/me/suggestions");
  // const suggestions = res.data?.data || [];
  const isAdmin = session.user?.role === "admin";
  // const isMember = session.user?.role === "member";

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-4">
        <h3 className="font-bold text-lg mb-1">Hi, {session.user.name}</h3>
        <h4 className="font-sans-bold text-sm mb-4">{session.user.phone}</h4>
        <h1 className="font-bold text-2xl mb-4">Dashboard</h1>
        {/* <SearchSongs /> */}
        <div className="space-y-2">
          {isAdmin ? (
          <ul>
            <li>
              <Link href="/dashboard" >Home</Link>
            </li>
            <li>
              <Link href="/dashboard/admin">Admin Panel</Link>
            </li>
            <li>
              <Link href="" ></Link>
            </li>
          </ul>
          ) : (
          <ul>
            <li>
              <Link href="/dashboard/user" >Profile</Link>
            </li>
            <li>
              <Link href="/dashboard">My Suggestions</Link>
            </li>
            <li>
              <Link href ="/songs">Song List</Link>
            </li>
            <li>
              <Link href ="/upload">Upload Song</Link>
            </li>
            <li>
              <Link href ="/auth/logout">Logout</Link>
            </li>
          </ul>
          )}
        </div>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
