import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function HuntDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [hunt, setHunt] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) fetchHunt();
  }, [id]);

  const fetchHunt = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`/api/users/hunts/${id}/hunt`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHunt(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement de la chasse :', err);
      setError('Impossible de charger les détails de la chasse.');
    }
  };

  const handleParticipate = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vous devez être connecté pour participer.');
      return;
    }

    try {
      const response = await axios.post(`/api/users/hunts/${id}/participate`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        router.push(`/hunts/${id}/map`);
      }
    } catch (err) {
      console.error('Erreur lors de la participation :', err.response || err);
      setError('Impossible de participer à la chasse.');
    }
  };

  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!hunt) return <p className="p-4">Chargement...</p>;

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-[#6B3FA0] to-[#A14CA0]">
      <h1 className="text-3xl font-bold mb-6 text-[#FAF7FF]">Détails de la chasse</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <p><strong>Titre :</strong> {hunt.title}</p>
        <p><strong>Description :</strong> {hunt.description || 'Aucune description'}</p>
        <p><strong>Lieu :</strong> {hunt.location || 'Non spécifié'}</p>
        <p><strong>Statut :</strong> {hunt.status}</p>
        <p><strong>Mode :</strong> {hunt.mode}</p>
        <p><strong>Organisateur :</strong> {hunt.createdBy?.email}</p>
        <p><strong>Début :</strong> {hunt.startDate ? new Date(hunt.startDate).toLocaleString() : 'Non défini'}</p>
        <p><strong>Fin :</strong> {hunt.endDate ? new Date(hunt.endDate).toLocaleString() : 'Non défini'}</p>
      </div>

      <div className="mt-6">
        <button
          onClick={handleParticipate}
          className="bg-[#6B3FA0] text-white px-4 py-2 rounded hover:bg-[#432B7D] transition"
        >
          Participer à cette chasse
        </button>
      </div>
    </div>
  );
}
