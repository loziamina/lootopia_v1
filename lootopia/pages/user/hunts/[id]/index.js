
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
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
      const response = await axios.get(`/api/user/hunts/${id}/hunt`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHunt(response.data);
    } catch (err) {
      console.error('Erreur lors de la récupération de la chasse :', err);
      setError('Impossible de charger les détails de la chasse.');
    }
  };

  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!hunt) return <p className="p-4">Chargement...</p>;

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Détails de la chasse</h1>
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
          onClick={() => router.push('/user/hunts')}
          className="ml-4 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
        >
          Retour à la liste
        </button>
    </div>
    </div>
  );
}
