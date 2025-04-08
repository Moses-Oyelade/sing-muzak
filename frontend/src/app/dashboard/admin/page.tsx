import axios from "axios";
import AdminDashboard from "@/components/AdminDashboard";


export default async function AdminPage() {

    const { data } = await axios.get("http://localhost:3000/songs?status=Pending");
    
    const songs = await data.json();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <AdminDashboard songs={songs} />
      </div>
    </div>
  );
}


