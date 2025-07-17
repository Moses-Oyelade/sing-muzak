// app/dashboard/user/layout.tsx

import NavBar from "@/components/NavBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* <MemberTab /> */}
      <NavBar />
      <main className="max-w-6xl mx-auto md:mt-0 mt-6 px-4">{children}</main>
    </div>
  );
}
