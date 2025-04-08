// app/dashboard/admin/layout.tsx
import AdminTabs from "@/components/AdminTabs";
import NavBar from "@/components/NavBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <NavBar />
      <AdminTabs />
      <main className="max-w-6xl mx-auto mt-6 px-4">{children}</main>
    </div>
  );
}
