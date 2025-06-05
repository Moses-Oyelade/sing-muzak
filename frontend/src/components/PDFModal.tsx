// components/PDFModal.tsx
"use client";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useState } from "react";

export default function PDFModal({ url }: { url: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="text-blue-500 underline mt-2"
        onClick={() => setIsOpen(true)}
      >
        View PDF
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <DialogPanel className="bg-white rounded p-4 w-full max-w-4xl h-[90vh] overflow-hidden">
          <iframe src={url} className="w-full h-full border" />
          <button
            className="mt-2 px-4 py-1 bg-gray-800 text-white rounded"
            onClick={() => setIsOpen(false)}
          >
            Close
          </button>
        </DialogPanel>
      </Dialog>
    </>
  );
}
