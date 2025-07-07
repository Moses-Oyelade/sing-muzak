'use client';

import axiosInstance from '@/utils/axios';
import React from 'react';

interface DownloadButtonProps {
  songId: string;
  inline?: boolean; // default true for viewing
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ songId, inline = true }) => {
  const handleDownload = async () => {
    try {
      const response = await axiosInstance.get(`/songs/${songId}/download?inline=${inline}`, {
        responseType: 'blob', // crucial
      });

      const blob = new Blob([response.data]);
      const blobUrl = URL.createObjectURL(blob);

      // Open in new tab
      window.open(blobUrl, '_blank');

      // Clean up blob URL when done
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000 * 60); // optional cleanup
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
    >
      {inline ? 'View File' : 'Download File'}
    </button>
  );
};

export default DownloadButton;
