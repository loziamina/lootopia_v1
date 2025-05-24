import React from 'react';

export default function HuntRow({ hunt, onDelete, onEdit, onView }) {
  return (
    <tr className="border-t hover:bg-gray-50 transition">
      <td className="py-3 px-4">{hunt.name}</td>
      <td className="py-3 px-4">{hunt.organizerName || '—'}</td>
      <td className="py-3 px-4">{hunt.createdAt ? new Date(hunt.createdAt).toLocaleDateString() : '—'}</td>
      <td className="py-3 px-4 flex gap-2 justify-center">
        <button
          onClick={() => onView(hunt.id)}
          className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition"
        >
          Voir
        </button>
        <button
          onClick={() => onEdit(hunt.id)}
          className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition"
        >
          Modifier
        </button>
        <button
          onClick={() => onDelete(hunt.id)}
          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
        >
          Supprimer
        </button>
      </td>
    </tr>
  );
}
