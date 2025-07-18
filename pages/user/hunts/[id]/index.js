import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ReviewForm from '@/components/dashboard/admin/reviews/ReviewForm';
import ReviewListPage from '@/components/dashboard/admin/reviews/ReviewListPage';

export default function HuntDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [hunt, setHunt] = useState(null);
  const [error, setError] = useState('');
  const [newReview, setNewReview] = useState(null);

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
      console.error('Erreur lors de la récupération de la chasse :', err);
      setError('Impossible de charger les détails de la chasse.');
    }
  };

  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!hunt) return <p className="p-4 text-white">Chargement...</p>;

  return (
    <div className="p-8 min-h-screen" style={{ backgroundColor: '#1A1A1A' }}>
      <h1 className="text-3xl font-bold mb-6" style={{ color: '#F9C449' }}>
        Détails de la chasse
      </h1>

      <div
        className="rounded-lg shadow p-6 space-y-4"
        style={{ backgroundColor: '#2A2A2A', border: '1px solid #3E2C75' }}
      >
        <p className="text-gray-300"><strong className="text-white">Titre :</strong> {hunt.title}</p>
        <p className="text-gray-300"><strong className="text-white">Description :</strong> {hunt.description || 'Aucune description'}</p>
        <p className="text-gray-300"><strong className="text-white">Lieu :</strong> {hunt.location || 'Non spécifié'}</p>
        <p className="text-gray-300"><strong className="text-white">Statut :</strong> {hunt.status}</p>
        <p className="text-gray-300"><strong className="text-white">Mode :</strong> {hunt.mode}</p>
        <p className="text-gray-300"><strong className="text-white">Organisateur :</strong> {hunt.createdBy?.email}</p>
        <p className="text-gray-300"><strong className="text-white">Début :</strong> {hunt.startDate ? new Date(hunt.startDate).toLocaleString() : 'Non défini'}</p>
        <p className="text-gray-300"><strong className="text-white">Fin :</strong> {hunt.endDate ? new Date(hunt.endDate).toLocaleString() : 'Non défini'}</p>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => router.push('/user/hunts')}
          className="bg-[#5C3E9E] text-white px-4 py-2 rounded hover:bg-[#432B7D] transition"
        >
          Retour à la liste
        </button>
        <button
          onClick={() => router.push(`/hunts/${id}/participate`)}
          className="bg-[#5C3E9E] text-white px-4 py-2 rounded hover:bg-[#432B7D] transition"
        >
          Rejoindre la chasse
        </button>
      </div>

      <div className="mt-10 rounded-lg shadow p-6" style={{ backgroundColor: '#2A2A2A', border: '1px solid #3E2C75' }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: '#F9C449' }}>Commentaires</h2>
        <ReviewForm huntId={id} onReviewAdded={setNewReview} />
        <ReviewListPage huntId={id} newReview={newReview} />
      </div>
    </div>
  );
}