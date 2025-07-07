'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axios';
import SongCard from '@/components/SongCard';
import FilterBar from '@/components/FilterBar';
import { useRouter } from 'next/navigation';
import SongSuggestion from '@/components/SongSuggestion';

const SuggestSongs = () => {
  const { data: session } = useSession();
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);

  const router = useRouter();
  const userId = session?.user?.id;

  // Fetch songs from the backend on component mount
  const fetchSongs = async (term = "") => {
    if (!session || !userId) return;
    try {
      setLoading(true);
      const endpoint = `/songs?search=${term}`
      const res = await axiosInstance.get(endpoint);
      const data = await res.data?.data || res.data;
      setSongs(data);
    } catch (err) {
      console.error("Failed to fetch songs:", err);
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

  const handleRoute = () => {
        router.push(`/dashboard`)
    }

  const handleSuggestSong = async (songId: string) => {
    try {
      await axiosInstance.post('/songs/suggest', { songId });
      const updated = songs.map(song =>
        song._id === songId ? { ...song, suggestedBy: userId } : song
      );
      setSongs(updated);
      alert('🎵 Song suggested successfully!');
      handleRoute()
    } catch (error: any) {
      if (error.response?.status === 409) {
        alert('You have already suggested this song.');
      } else {
        console.error(error);
        alert('Something went wrong while suggesting the song.');
      }
    }
  };


  if (loading) return <p className="p-4 text-center">Loading songs...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className='gap-4 p-4'>
        <button
          onClick={() => router.back()}
          className='mb-4 px-4 py-2 rounded hover:bg-gray-300'
        >
          ⇐ Back
        </button>
        <FilterBar onFilter={handleFilter} />
        <button
          onClick={() => setShowSuggestionForm(prev => !prev)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showSuggestionForm ? 'Hide Suggest Form' : 'Suggest a New Song'}
        </button>

        {showSuggestionForm && (
          <div className="mt-4">
            <SongSuggestion />
          </div>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {songs.length > 0 ? (
              songs.map((song) => {
          return (
              <div key={song._id} className="border p-4 rounded-lg shadow">
              <SongCard song={song} />
                  <button
                  disabled={!!song.suggestedBy}
                  onClick={() => handleSuggestSong(song._id)}
                  className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                  {song.suggestedBy ? "Already Suggested" : "Suggest Song"}
                  </button>
              </div>
            );
          })
        ) : (
            <p>No songs found.</p>
        )}
      </div>
    </div>
  );
};

export default SuggestSongs;
