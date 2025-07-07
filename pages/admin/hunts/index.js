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
    <div className="p-8 min-h-screen bg-gradient-to-r from-[#6B3FA0] to-[#A14CA0]">
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-bold text-[#FAF7FF]">Gestion des chasses</h1>
    <button
      onClick={() => router.push('/admin/hunts/create')}
      className="bg-[#32A67F] text-white px-4 py-2 rounded hover:bg-[#251B47] transition"
    >
      + Créer une chasse
    </button>
  </div>

  {hunts.length === 0 ? (
    <p className="text-center text-[#251B47]">Aucune chasse enregistrée pour le moment.</p>
  ) : (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hunts.map((hunt) => (
        <div key={hunt.id} className="bg-white shadow-md p-5 rounded-lg border">
          <h2
            className="text-xl font-semibold text-[#3E2C75] hover:underline cursor-pointer mb-2"
            onClick={() => router.push(`/admin/hunts/${hunt.id}`)}
          >
            {hunt.title}
          </h2>
          <p className="text-sm text-[#251B47] mb-1">{hunt.description || 'Pas de description'}</p>
          <p className="text-xs text-[#251B47]">Créée par : {hunt.createdBy?.email || 'Inconnu'}</p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => router.push(`/admin/hunts/${hunt.id}/edit`)}
              className="bg-[#251B47] text-white px-3 py-1 rounded hover:bg-[#3E2C75] text-sm"
            >
              Modifier
            </button>
            <button
              onClick={() => handleDelete(hunt.id)}
              className="bg-[#D24D79] text-white px-3 py-1 rounded hover:bg-[#F9C449] text-sm"
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
