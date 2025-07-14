import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function AdminHuntPage() {
  const [hunts, setHunts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchHunts();
  }, []);

  const fetchHunts = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get("/api/admin/hunts/hunts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHunts(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des chasses :", error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const confirmDelete = confirm("Confirmer la suppression de cette chasse ?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/admin/hunts/${id}/hunt`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHunts(hunts.filter((hunt) => hunt.id !== id));
    } catch (error) {
      console.error("Erreur suppression :", error);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-[#1B1B1F] text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#F9C449]">🗺️ Chasses au trésor</h1>
        <button
          onClick={() => router.push('/admin/hunts/create')}
          className="bg-[#5C3E9E] hover:bg-[#7C5FC3] transition text-white px-5 py-2 rounded"
        >
          + Ajouter une chasse
        </button>
      </div>

      {hunts.length === 0 ? (
        <p className="text-center text-gray-400">Aucune chasse enregistrée pour le moment.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hunts.map((hunt) => (
            <div key={hunt.id} className="bg-[#2A2A2E] p-5 rounded-lg shadow-lg border border-[#3E2C75]">
              <h2
                className="text-xl font-semibold text-[#F9C449] hover:underline cursor-pointer mb-2"
                onClick={() => router.push(`/admin/hunts/${hunt.id}`)}
              >
                {hunt.title}
              </h2>
              <p className="text-sm text-gray-300 mb-1">{hunt.description || 'Pas de description'}</p>
              <p className="text-xs text-gray-400">Créée par : {hunt.createdBy?.email || 'Inconnu'}</p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => router.push(`/admin/hunts/${hunt.id}/edit`)}
                  className="bg-[#32A67F] hover:bg-[#2F8668] text-white px-3 py-1 rounded text-sm transition"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(hunt.id)}
                  className="bg-[#D24D79] hover:bg-[#F9C449] text-white px-3 py-1 rounded text-sm transition"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
