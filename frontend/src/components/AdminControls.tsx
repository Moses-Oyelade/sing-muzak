// "use client";

// import { useEffect, useState } from "react";
// import axiosInstance from "@/utils/axios";
// import { toast } from "react-hot-toast";
// import io from "socket.io-client";

// const socket = io(process.env.NEXT_PUBLIC_API_URL);

// export default function AdminControls() {
//   const [songs, setSongs] = useState([]);
//   const [statusTab, setStatusTab] = useState("All");
//   const [categoryFilter, setCategoryFilter] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [updatingSongId, setUpdatingSongId] = useState<string | null>(null);

//   const getSongs = async () => {
//     setLoading(true);
//     let url = `/songs/filter?page=${page}`;
//     if (statusTab !== "All") url += `&status=${statusTab}`;
//     if (categoryFilter) url += `&search=${categoryFilter}`;

//     try {
//       const res = await axiosInstance.get(url);
//       const data = res.data;
//       setSongs(Array.isArray(data.songs) ? data.songs : []);
//       setTotalPages(data.data?.totalPages || 1);
//     } catch (err) {
//       console.error("Error loading songs:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getCategories = async () => {
//     try {
//       const res = await axiosInstance.get("/categories");
//       setCategories(res.data || []);
//     } catch (err) {
//       console.error("Failed to load categories", err);
//     }
//   };

//   useEffect(() => {
//     getSongs();
//   }, [statusTab, categoryFilter, page]);

//   useEffect(() => {
//     getCategories();

//     socket.on("song:uploaded", (newSong) => {
//       toast.success(`🎶 New song uploaded: ${newSong.title}`);
//       getSongs();
//     });

//     socket.on("song:status-updated", (updatedSong) => {
//       toast.success(`✅ ${updatedSong.title} status updated to ${updatedSong.status}`);
//       getSongs();
//     });

//     return () => {
//       socket.off("song:uploaded");
//       socket.off("song:status-updated");
//     };
//   }, []);

//   const updateSongStatus = async (songId: string, newStatus: string) => {
//     const confirmAction = window.confirm(`Are you sure you want to ${newStatus.toLowerCase()} this song?`);
//     if (!confirmAction) return;

//     setUpdatingSongId(songId);
//     try {
//       await axiosInstance.patch(`/songs/${songId}`, { status: newStatus });
//       toast.success(`Song ${newStatus.toLowerCase()} successfully`);
//       getSongs();
//     } catch (err: any) {
//       toast.error(err?.response?.data?.message || "Failed to update song status");
//     } finally {
//       setUpdatingSongId(null);
//     }
//   };

//   return (
//     <div className="p-4 max-w-5xl mx-auto">
//       <h2 className="text-xl font-bold mb-4 text-center sm:text-left">Admin Dashboard</h2>

//       {/* Status Tabs */}
//       <div className="flex flex-wrap gap-2 mb-4">
//         {["All", "Approved", "Pending", "Postponed"].map((tab) => (
//           <button
//             key={tab}
//             className={`px-3 py-1 rounded text-sm ${
//               statusTab === tab
//                 ? "bg-purple-600 text-white"
//                 : "bg-gray-300 text-black"
//             }`}
//             onClick={() => {
//               setStatusTab(tab);
//               setPage(1);
//             }}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* Category Filter */}
//       <div className="mb-6">
//         <select
//           className="border p-2 rounded w-full sm:w-auto"
//           value={categoryFilter}
//           onChange={(e) => {
//             setCategoryFilter(e.target.value);
//             setPage(1);
//           }}
//         >
//           <option value="">All Categories</option>
//           {categories.map((cat: any) => (
//             <option key={cat._id} value={cat.name}>
//               {cat.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Song List */}
//       {loading ? (
//         <p className="text-center text-gray-600 animate-pulse">Loading songs...</p>
//       ) : songs.length === 0 ? (
//         <p className="text-center text-red-500">No songs found.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {songs.map((song: any) => (
//             <div key={song._id} className="border p-4 rounded bg-white shadow-sm">
//               <h3 className="text-lg font-semibold">{song.title}</h3>
//               <p className="text-sm">Artist: {song.artist}</p>
//               <p className="text-sm">Category: {song.category}</p>
//               <p className="text-sm">Status: {song.status}</p>

//               {/* PDF & Audio Preview */}
//               {song.sheetMusicUrl && (
//                 <iframe
//                   src={song.sheetMusicUrl}
//                   className="w-full h-40 border mt-2"
//                   title={`Sheet music for ${song.title}`}
//                 />
//               )}

//               {song.audioUrl && (
//                 <audio controls className="w-full mt-2">
//                   <source src={song.audioUrl} type="audio/mpeg" />
//                   Your browser does not support the audio element.
//                 </audio>
//               )}

//               {/* Action Buttons */}
//               <div className="flex flex-col sm:flex-row gap-2 mt-4">
//                 <button
//                   disabled={updatingSongId === song._id}
//                   onClick={() => updateSongStatus(song._id, "Approved")}
//                   className={`px-3 py-1 rounded text-white ${
//                     updatingSongId === song._id
//                       ? "bg-green-300 cursor-not-allowed"
//                       : "bg-green-600 hover:bg-green-500"
//                   }`}
//                 >
//                   {updatingSongId === song._id ? "Updating..." : "Approve"}
//                 </button>
//                 <button
//                   disabled={updatingSongId === song._id}
//                   onClick={() => updateSongStatus(song._id, "Postponed")}
//                   className={`px-3 py-1 rounded text-white ${
//                     updatingSongId === song._id
//                       ? "bg-yellow-300 cursor-not-allowed"
//                       : "bg-yellow-500 hover:bg-yellow-400"
//                   }`}
//                 >
//                   {updatingSongId === song._id ? "Updating..." : "Postpone"}
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Pagination */}
//       <div className="mt-6 flex justify-center items-center gap-4">
//         <button
//           disabled={page <= 1}
//           onClick={() => setPage((p) => p - 1)}
//           className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
//         >
//           Prev
//         </button>
//         <span className="text-sm">
//           Page {page} of {totalPages}
//         </span>
//         <button
//           disabled={page >= totalPages}
//           onClick={() => setPage((p) => p + 1)}
//           className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }
