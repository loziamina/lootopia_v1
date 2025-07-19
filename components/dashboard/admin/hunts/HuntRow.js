import React from 'react';

export default function HuntRow({ hunt, onDelete, onEdit, onView }) {
  return (
    <tr className="border-t border-gray-700 hover:bg-[#2B2B2B] transition">
      <td className="py-4 px-4 text-[#FAF7FF]">{hunt.name}</td>
      <td className="py-4 px-4 text-gray-300">{hunt.organizerName || '—'}</td>
      <td className="py-4 px-4 text-gray-400">
        {hunt.createdAt ? new Date(hunt.createdAt).toLocaleDateString() : '—'}
      </td>
      <td className="py-4 px-4">
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => onView(hunt.id)}
          className="px-3 py-1 bg-[#6B3FA0] text-white text-sm rounded hover:bg-[#7E48C2] transition"
        >
          Voir
        </button>
        <button
          onClick={() => onEdit(hunt.id)}
          className="px-3 py-1 bg-[#F9C449] text-black text-sm rounded hover:bg-[#E0B030] transition"
        >
          Modifier
        </button>
        <button
          onClick={() => onDelete(hunt.id)}
          className="px-3 py-1 bg-[#D24D79] text-white text-sm rounded hover:bg-[#B83A63] transition"
        >
          Supprimer
        </button>
      </div>
    </td>
    </tr>
  );
}
