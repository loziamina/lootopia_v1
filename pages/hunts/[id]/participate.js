import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
    if (!token) {
      setError('Vous devez être connecté.');
      return;
    }

    try {
      // 1. Essayer la route utilisateur
      const response = await axios.get(`/api/users/hunts/${id}/hunt`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHunt(response.data);
    } catch (err) {
      // 2. Si erreur 403, tenter la route admin
      if (err.response && err.response.status === 403) {
        try {
          const adminResponse = await axios.get(`/api/admin/hunts/${id}/hunt`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setHunt(adminResponse.data);
        } catch (adminErr) {
          console.error('Erreur admin lors du chargement de la chasse :', adminErr);
          setError('Impossible de charger les détails de la chasse.');
        }
      } else {
        console.error('Erreur lors du chargement de la chasse :', err);
        setError('Impossible de charger les détails de la chasse.');
      }
    }
  };

  const handleParticipate = async () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role === 'ADMIN') {
      setError("Seuls les utilisateurs peuvent participer aux chasses.");
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

      {localStorage.getItem('role') !== 'ADMIN' && (
        <div className="mt-6">
          <button
            onClick={handleParticipate}
            className="text-white px-4 py-2 rounded transition"
            style={{
              backgroundColor: '#5C3E9E',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#432B7D')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#5C3E9E')}
          >
            Participer à cette chasse
          </button>
        </div>
      )}

      <ReviewForm huntId={id} onReviewAdded={setNewReview} />
      <ReviewListPage huntId={id} newReview={newReview} />
    </div>
  );
}
