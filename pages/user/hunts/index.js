import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function USERHuntPage() {
  const [hunts, setHunts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchHunts();
  }, []);

  const fetchHunts = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get('/api/users/hunts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHunts(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des chasses :', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'text-gray-400';
      case 'IN_PROGRESS':
        return 'text-green-500';
      case 'COMPLETED':
        return 'text-red-500';
      default:
        return 'text-gray-300';
    }
  };

  return (
    <div className="p-8 min-h-screen" style={{ backgroundColor: '#1A1A1A' }}>
      <h1 className="text-3xl font-bold mb-8 text-[#F9C449]">Mes Chasses</h1>

      {hunts.length === 0 ? (
        <p className="text-center text-gray-300">Aucune chasse enregistrée pour le moment.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hunts.map((hunt) => (
            <div
              key={hunt.id}
              className="p-5 rounded-lg shadow border"
              style={{ backgroundColor: '#2A2A2A', borderColor: '#3E2C75' }}
            >
              <h2
                className="text-xl font-semibold mb-2 cursor-pointer hover:underline"
                style={{ color: '#F9C449' }}
                onClick={() => router.push(`/user/hunts/${hunt.id}`)}
              >
                {hunt.title}
              </h2>
              <p className="text-sm text-gray-300 mb-1">{hunt.description || 'Pas de description'}</p>
              <p className="text-xs text-gray-400 mb-1">Créée par : {hunt.createdBy?.email || 'Inconnu'}</p>
              <p className={`text-sm font-bold ${getStatusColor(hunt.status)}`}>
                Statut : {hunt.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
