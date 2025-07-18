"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";



export default function UploadPage() {
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();


    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
        try {
            const res = await axiosInstance.get("/categories"); // adjust if needed
            const data = res.data
            setCategories(data || []);
        } catch (error) {
            console.error("Failed to load categories", error);
        }
        };

        fetchCategories();
    }, []);

    const handleRoute = () => {
        router.push(`/dashboard`)
    }

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title || !artist || !category) {
        alert("Please fill in the fields!");
        return;
        };

        const payload = {
          title,
          artist,
          category,
        };
        

        try {
        setLoading(true);
        await axiosInstance.post("/songs/suggest", payload);
        alert("Song uploaded successfully!");

        setTitle("");
        setArtist("");
        setCategory("");
        setAudioFile(null);
        setPdfFile(null);

        // router.push("/dashboard");
        handleRoute()
        } catch (error) {
        console.error(error);
        alert("Failed!");
        } finally {
        setLoading(false);
        }
    };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4">Suggest new Song</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="text"
          placeholder="Song Title"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Artist Name"
          className="w-full p-2 border rounded"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          required
        />
        <select
          className="w-full p-2 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}

        >
          <option value="">Select Category</option>
          {categories.map((cat: any) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
            disabled={loading}
            >
            {loading ? "loading..." : "Suggest Song"}
          </button>
          {/* <Link href ="/dashboard"> */}
            <button  
                onClick={handleRoute}
                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700"
                disabled={loading}
              >
              {/* {loading ? "Canceling..." : "Cancel"} */}
              Cancel
            </button>
          {/* </Link> */}
        </div>
      </form>
    </div>
  );
}
