import React from 'react';

export default function HuntSearch({ search, setSearch }) {
  return (
    <div className="mb-6 max-w-md mx-auto">
      <input
        type="text"
        placeholder="Rechercher une chasse ou un organisateur..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
