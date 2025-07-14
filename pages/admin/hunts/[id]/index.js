import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import HuntDetails from '@/components/dashboard/admin/hunts/HuntDetails';
import ReviewForm from '@/components/dashboard/admin/reviews/ReviewForm';
import ReviewListPage from '@/components/dashboard/admin/reviews/ReviewListPage';

export default function AdminHuntDetail() {
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
      const res = await axios.get(`/api/admin/hunts/${id}/hunt`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHunt(res.data);
    } catch (err) {
      setError('Erreur de chargement');
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
      setError('Erreur lors de la participation.');
    }
  };

  if (error) return <p className="text-red-500 p-4">{error}</p>;
  if (!hunt) return <p className="p-4 text-white">Chargement...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B1B1F] to-[#2A2A2E] py-10 px-4 text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="bg-[#2A2A2E] border border-[#3E2C75] rounded-lg p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-[#F9C449] mb-4">🎯 Détails de la chasse</h1>
          <HuntDetails hunt={hunt} onParticipate={handleParticipate} isAdmin={true} />
        </div>

        <div className="bg-[#2A2A2E] border border-[#32A67F] rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-[#32A67F] mb-4">💬 Ajouter un avis</h2>
          <ReviewForm huntId={id} onReviewAdded={() => fetchHunt()} />
        </div>

        <div className="bg-[#2A2A2E] border border-[#251B47] rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-[#F9C449] mb-4">🗂 Avis des utilisateurs</h2>
          <ReviewListPage huntId={id} />
        </div>
      </div>
    </div>
  );
}
