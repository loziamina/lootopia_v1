import React from 'react';

export default function HuntSearch({ search, setSearch }) {
  return (
    <div className="mb-6 max-w-md mx-auto">
      <input
        type="text"
        placeholder="🔍 Rechercher une chasse ou un organisateur..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 bg-[#1F1F1F] text-white placeholder-gray-400 border border-gray-600 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#6B3FA0] transition"
      />
    </div>
  );
}
