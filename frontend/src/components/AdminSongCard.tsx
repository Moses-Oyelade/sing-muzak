import axios from "axios";

// export default function AdminSongCard({song} : any, {setPendingSongs} : any ) {
export default function AdminSongCard({song} : any ) {
  const updateStatus = async (status: string, songId: string) => {
    try {
      await axios.put(`/songs/${song._id}/status`, { status });
      alert(`Song ${status}!`);
    } catch (error) {
      alert("Failed to update status.");
    }

    // setPendingSongs((prev: any[]) =>
    //   prev.map(song => song._id === songId ? { ...song, status } : song)
    // );
  };

  return (
    <div className="p-4 border rounded shadow">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold">{song.title}</h3>
          <p>Artist: {song.artist}</p>
          <p>Category: {song.category?.name || song.category }</p>
          <p>Suggested by: {song.suggestedBy?.name || null }</p>
        </div>
        <span className={`px-2 py-1 rounded text-white text-sm ${song.status === "Approved" ? "bg-green-500" : song.status === "Postponed" ? "bg-yellow-500" : "bg-gray-500"}`}>
            {song.status}
        </span>
      </div>
        <div className="flex gap-4">
            {song.audioUrl && (
              <a href={song.audioUrl} target="_blank" rel="noopener" className="text-blue-600 underline">Audio</a>
            )}
            {song.sheetMusicUrl && (
              <a href={song.sheetMusicUrl} target="_blank" rel="noopener" className="text-purple-600 underline">PDF</a>
            )}
        </div>
      <div className="mt-2 flex gap-2">
        <button
          className="bg-green-500 text-white px-4 py-1 rounded"
          onClick={() => updateStatus("Approved", song._id)}
        >
          Approve
        </button>
        <button
          className="bg-yellow-500 text-white px-4 py-1 rounded"
          onClick={() => updateStatus("Postponed", song._id)}
        >
          Postpone
        </button>
      </div>
    </div>
  );
}
