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
      const response = await axios.get("/api/user/hunts/hunts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHunts(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des chasses :", error);
    }
  };


  return (
    <div className="p-8 min-h-screen bg-gray-50">
  
      {hunts.length === 0 ? (
        <p className="text-center text-gray-600">Aucune chasse enregistrée pour le moment.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hunts.map((hunt) => (
            <div key={hunt.id} className="bg-white shadow-md p-5 rounded-lg border">
              <h2
                className="text-xl font-semibold text-blue-700 hover:underline cursor-pointer mb-2"
                onClick={() => router.push(`/user/hunts/${hunt.id}`)}
              >
                {hunt.title}
              </h2>
              <p className="text-sm text-gray-600 mb-1">{hunt.description || 'Pas de description'}</p>
              <p className="text-xs text-gray-500">Créée par : {hunt.createdBy?.email || 'Inconnu'}</p>
              <div className="mt-4 flex justify-end gap-2">
              <button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition'
                onClick={() => router.push(`/user/hunts/${hunt.id}/game`)} >
                Paticiper
              </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
