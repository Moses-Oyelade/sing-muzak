// app/dashboard/layout.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
// import LogoutButton from "@/components/LogoutButton";
import LogoutPage  from '../auth/logout/page';
import SearchSongs from "./SearchSongs";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p>Unauthorized</p>;
  }

  const isAdmin = session.user?.role === "admin";

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-4">
        <h2 className="font-bold text-lg mb-4">Dashboard</h2>
        <SearchSongs />
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard">My Suggestions</Link>
          </li>
          {isAdmin && (
            <li>
              <Link href="/dashboard/admin">Admin Panel</Link>
            </li>
          )}
          <li>
            <Link href ="/auth/logout">Logout</Link>
          </li>
        </ul>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
