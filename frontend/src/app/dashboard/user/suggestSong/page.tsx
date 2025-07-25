'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axios';
import SongCard from '@/components/SongCard';
import FilterBar from '@/components/FilterBar';
import { useRouter } from 'next/navigation';
import SongSuggestion from '@/components/SongSuggestion';

export default function SuggestSongs() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();

  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);

  const fetchSongs = async (term = '') => {
    if (!session || !userId) return;
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/songs?search=${term}`);
      const data = res.data?.data || res.data;
      setSongs(data);
    } catch (err) {
      console.error('Failed to fetch songs:', err);
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs(searchTerm);
  }, [searchTerm]);

  const handleFilter = (term: string) => {
    setSearchTerm(term);
  };

  const handleRouteBack = () => {
    router.push('/dashboard');
  };

  const handleSuggestSong = async (songId: string) => {
    try {
      await axiosInstance.post('/songs/suggest', { songId });
      const updated = songs.map((song) =>
        song._id === songId ? { ...song, suggestedBy: userId } : song
      );
      setSongs(updated);
      alert('🎵 Song suggested successfully!');
      handleRouteBack();
    } catch (error: any) {
      if (error.response?.status === 409) {
        alert('You have already suggested this song.');
      } else {
        console.error(error);
        alert('Something went wrong while suggesting the song.');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-2">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => router.back()}
          className='mb-4 mr-4 px-4 py-2 rounded hover:bg-gray-300'
        >
          ⇐ Back
        </button>
        <button
          onClick={() => setShowSuggestionForm((prev) => !prev)}
          className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showSuggestionForm ? 'Hide Suggest Form' : 'Suggest a New Song'}
        </button>
      </div>

      {showSuggestionForm && (
        <div className="mb-6">
          <SongSuggestion />
        </div>
      )}

      <FilterBar onFilter={handleFilter} />

      {loading ? (
        <p className="text-center text-gray-500 mt-6">Loading songs...</p>
      ) : songs.length > 0 ? (
        <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {songs.map((song: any) => (
            <div key={song._id} className="border rounded bg-slate-300 p-4 shadow">
              <SongCard song={song} />
              <button
                disabled={!!song.suggestedBy}
                onClick={() => handleSuggestSong(song._id)}
                className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {song.suggestedBy ? 'Already Suggested' : 'Suggest Song'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-red-600 mt-6">No songs found.</p>
      )}
    </div>
  );
}
