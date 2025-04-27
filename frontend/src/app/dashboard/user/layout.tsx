// app/dashboard/admin/layout.tsx

import MemberTab from "@/components/MemberTab";
import NavBar from "@/components/NavBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <NavBar />
      <MemberTab />
      <main className="max-w-6xl mx-auto mt-6 px-4">{children}</main>
    </div>
  );
}
