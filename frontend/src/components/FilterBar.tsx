// app/dashboard/components/FilterBar.tsx
"use client";
import { useState } from "react";

export default function FilterBar({ onFilter }: { onFilter: (term: string) => void }) {
  const [term, setTerm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(term);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 md:mt-0 md:mr-2 flex items-center mr-4 gap-2">
      <input
        type="text"
        placeholder="Search songs..."
        className="border rounded px-2 py-1"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      <button className="bg-blue-500 text-white md:mr-2 px-3 py-1 rounded" type="submit">
        Search
      </button>
    </form>
  );
}
