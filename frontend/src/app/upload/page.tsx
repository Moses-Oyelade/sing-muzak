"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";



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

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !artist || !category || (!audioFile && !pdfFile)) {
      alert("Please fill in the fields and upload at least one file (audio or PDF)!");
      return;
    }
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("category", category);

    if (audioFile) {
      formData.append("audio", audioFile);
    }
    if(pdfFile){
      formData.append("file", pdfFile);
    }

    try {
      setLoading(true);
      axiosInstance.post("/songs/upload", formData);
      alert("Song uploaded successfully!");
      setTitle("");
      setArtist("");
      setCategory("");
      setAudioFile(null);
      setPdfFile(null);
    } catch (error) {
      console.error(error);
      alert("Upload failed!");
    } finally {
      setLoading(false);
      router.push("/dashboard");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4">Upload a Song</h2>
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
        <p className="w-full p-2 border rounded">Upload Audio 🎵 : 
          <input
            type="file"
            accept="audio/*, video/*"
            onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
          />
        </p>
        <p className="w-full p-2 border rounded">Upload PDF 📋 : 
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
          />
        </p>
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            disabled={loading}
            >
            {loading ? "Uploading..." : "Upload Song"}
          </button>
          <Link href ="/dashboard">
            <button  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700">
              {loading ? "Canceling..." : "Cancel"}
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}
