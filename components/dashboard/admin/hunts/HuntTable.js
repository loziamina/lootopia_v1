import React from 'react';
import HuntRow from './HuntRow';

export default function HuntTable({ hunts, onDelete, onEdit, onView }) {
  return (
    <div className="overflow-x-auto rounded-lg shadow-lg">
      <table className="min-w-full bg-[#1A1A1A] text-white">
        <thead className="bg-[#2A2A2A] text-[#F9C449]">
          <tr>
            <th className="py-3 px-4 text-left">Titre</th>
            <th className="py-3 px-4 text-left">Organisateur</th>
            <th className="py-3 px-4 text-left">Créée le</th>
            <th className="py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {hunts.map((hunt) => (
            <HuntRow
              key={hunt.id}
              hunt={hunt}
              onDelete={onDelete}
              onEdit={onEdit}
              onView={onView}
            />
          ))}
          {hunts.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-400">
                Aucune chasse trouvée.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
