import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import HuntDetails from '@/components/dashboard/admin/hunts/HuntDetails';

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
      const res = await axios.get(`/api/users/hunts/${id}/hunt`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHunt(res.data);
    } catch (err) {
      console.error('Erreur :', err);
      setError("Impossible de charger la chasse.");
    }
  };

  const handleParticipate = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`/api/users/hunts/${id}/participate`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push(`/hunts/${id}/map`);
    } catch (err) {
      setError("Participation échouée.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        {!hunt ? (
          <p className="text-gray-600 text-center">Chargement...</p>
        ) : (
          <HuntDetails hunt={hunt} onParticipate={handleParticipate} />
        )}
      </div>
    </div>
  );
}
