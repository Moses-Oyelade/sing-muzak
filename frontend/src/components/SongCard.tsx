import React from "react";
import DownloadButton from "./DownloadButton";


export default function SongCard({song}: any ) {
  return (
    <div className="p-4 border rounded shadow">
      <h3 className="font-bold">{song.title || 'Untitled'}</h3>
      <p>Artist: {song.artist}</p>
      <p>Status: {song.status|| "Pending"}</p>
      <p>Category: {song.category?.name || song.category}</p>
      <div className="flex gap-2 mt-2">
        <DownloadButton songId={song._id} inline={true} />     {/* View PDF/MP3 in browser */}
        <DownloadButton songId={song._id} inline={false} />    {/* Trigger file download */}
      </div>
    </div>
  );
}



// export default function SongCard({song}: any ) {
//   return (
//     <div className="p-4 border rounded shadow">
//       <h3 className="font-bold">{song.title || 'Untitled'}</h3>
//       <p>Artist: {song.artist}</p>
//       <p>Status: {song.status|| "Pending"}</p>
//       <p>Category: {song.category?.name || song.category}</p>
//       {song.audioUrl && (
//         <>
//           <audio controls className="mt-2">
//             <source src={song.audioUrl} type="audio/mp3" />
//           </audio>
//           <a
//             href={song.audioUrl}
//             download
//             className="text-blue-600 hover:underline mr-4"
//           >
//             ⬇️ Download Audio
//           </a>
//         </>
//       )}
//       {song.pdfUrl && (
//         <>
//           <a
//             href={song.pdfUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-600 hover:underline"
//             >
//               📄 View PDF
//           </a>
//           <a
//             href={song.pdfUrl}
//             download
//             className="text-blue-600 hover:underline"
//             >
//               ⬇️ Download PDF
//             </a>
//         </>
//       )}
//     </div>
//   );
// }
