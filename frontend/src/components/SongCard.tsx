import React from "react";


export default function SongCard({song}: any ) {
  return (
    <div className="p-4 border bg-white rounded shadow">
      <h3 className="font-bold">{song.title || 'Untitled'}</h3>
      <p>Artist: {song.artist}</p>
      <p>Status: {song.status|| "Pending"}</p>
      <p>Category: {song.category?.name || song.category}</p>
    </div>
  );
}

