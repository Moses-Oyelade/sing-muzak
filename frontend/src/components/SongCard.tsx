import React from "react";
import DownloadButton from "./DownloadButton";


export default function SongCard({song}: any ) {
  return (
    <div className="p-4 border rounded shadow">
      <h3 className="font-bold">{song.title || 'Untitled'}</h3>
      <p>Artist: {song.artist}</p>
      <p>Status: {song.status|| "Pending"}</p>
      <p>Category: {song.category?.name || song.category}</p>
    </div>
  );
}

