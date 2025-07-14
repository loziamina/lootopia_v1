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
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get("/api/users/hunts", {
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
    <div className="p-8 min-h-screen bg-gradient-to-r from-[#6B3FA0] to-[#A14CA0]">
  <div className="flex justify-between items-center mb-6">

  </div>

  {hunts.length === 0 ? (
    <p className="text-center text-[#251B47]">Aucune chasse enregistrée pour le moment.</p>
  ) : (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hunts.map((hunt) => (
        <div key={hunt.id} className="bg-white shadow-md p-5 rounded-lg border">
          <h2
            className="text-xl font-semibold text-[#3E2C75] hover:underline cursor-pointer mb-2"
            onClick={() => router.push(`/user/hunts/${hunt.id}`)}
          >
            {hunt.title}
          </h2>
          <p className="text-sm text-[#251B47] mb-1">{hunt.description || 'Pas de description'}</p>
          <p className="text-xs text-[#251B47]">Créée par : {hunt.createdBy?.email || 'Inconnu'}</p>
         
        </div>
      ))}
    </div>
  )}
</div>

  );
}
