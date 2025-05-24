import React from 'react';
import HuntRow from './HuntRow';

export default function HuntTable({ hunts, onDelete, onEdit, onView }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-gray-100 text-gray-700">
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
              <td colSpan="4" className="text-center py-4 text-gray-500">
                Aucune chasse trouvée.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
