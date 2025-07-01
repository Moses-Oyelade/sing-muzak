'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axios';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function SongForm() {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get('/categories');
        setCategories(res.data || []);
      } catch (error) {
        console.error('Failed to load categories', error);
      }
    };
    fetchCategories();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !artist || !category || (!audioFile && !pdfFile)) {
      alert('Please fill all fields and upload at least one file.');
      return;
    }

    if (!session?.user?.id || !session.user.token) {
      alert('You must be logged in.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('category', category); // this is category._id
    formData.append('uploadedBy', session.user.id); // backend expects this

    if (audioFile) formData.append('audio', audioFile);
    if (pdfFile) formData.append('pdf', pdfFile);

    try {
      setLoading(true);

      const res = await axiosInstance.post('/songs/upload', formData, {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      });

      console.log('Upload successful:', res.data);
      alert('Song uploaded successfully!');
      setTitle('');
      setArtist('');
      setCategory('');
      setAudioFile(null);
      setPdfFile(null);
      router.push('/dashboard/admin');
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Upload failed!';
      console.error('Upload failed:', message);
      alert(`Upload failed: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
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
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat: any) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        <div>
          <label className="block mb-1 font-medium">Audio File 🎵</label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">PDF File 📋</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload Song'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard/admin')}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
