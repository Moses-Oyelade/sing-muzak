"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Category {
  id: string;
  name: string;
}

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

   // Fetch categories on mount
   useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:3000/categories"); // adjust if needed
        setCategories(res.data);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };

    fetchCategories();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
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
      await axios.post("/songs", formData);
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
          {/* <option value="">Select Category</option>
          <option value="Worship">Worship</option>
          <option value="Praise">Praise</option> */}

          <option value="">Select Category</option>
          {categories.map((cat: Category) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="file"
          className="w-full p-2 border rounded"
          accept="audio/*"
          onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
        />
        <input
          type="file"
          className="w-full p-2 border rounded"
          accept="application/pdf"
          onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Song"}
        </button>
      </form>
    </div>
  );
}
