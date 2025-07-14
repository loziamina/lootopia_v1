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
      setError('Impossible de charger la chasse.');
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
      setError('Participation échouée.');
    }
  };

  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!hunt) return <p className="p-4">Chargement...</p>;

  return <HuntDetails hunt={hunt} onParticipate={handleParticipate} />;
}
