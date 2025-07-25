// Server Component: page.tsx
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import createAxiosWithAuth from "@/utils/axiosServer";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import ClientAnnouncementPage from "@/components/ClientAnnouncementPage";

interface Announcement {
  _id: string;
  title: string;
  content: string;
  publishedAt?: string;
}

export default async function AnnouncementDetail({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.token) redirect("/auth/login");

  const axios = createAxiosWithAuth(session.user.token);
  const id = params.id;

  try {
    const res = await axios.get(`/announcements/${id}`);
    const announcement: Announcement = res.data;
    const isAdmin = session.user.role === "admin";

    return (
      <ClientAnnouncementPage
        announcement={announcement}
        isAdmin={isAdmin}
      />
    );
  } catch (error) {
    return (
      <div className="p-6 text-red-500">
        Announcement not found or failed to load.
      </div>
    );
  }
}
