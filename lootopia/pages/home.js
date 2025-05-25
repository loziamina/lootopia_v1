import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import UserHuntPage from '../components/dashboard/user/hunts/HuntListPage'; 

export default function Home() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/auth/login');
    } else {
      fetch('/api/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Unauthorized');
          return res.json();
        })
        .then((data) => {
          setFirstName(data.firstName);
        })
        .catch(() => {
          localStorage.removeItem('token');
          router.push('/auth/login');
        });
    }
  }, []);

  const handleChaseClick = (chaseId) => {
    router.push(`/chase/${chaseId}`);
  };

  return (
    <div className="min-h-screen bg-green-100">
      <div className="flex justify-between p-4 bg-green-700 text-white">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Bonjour {firstName}</h1>
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">PLAYER MODE</h2>
        <p className="text-2xl">Bienvenue dans Lootopia</p>
      </div>

      {/* Exemple de carte chasse clickable */}
      <div
        className="bg-white p-4 rounded-lg shadow-md w-64 cursor-pointer hover:bg-gray-200"
        onClick={() => handleChaseClick(2)}
      >
      </div>

      <UserHuntPage />
    </div>
  );
}
