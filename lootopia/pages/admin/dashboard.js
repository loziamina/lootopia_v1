import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // Vérifie le rôle depuis l'API (à faire dans l'étape 3.2)
    fetch('/api/admin/check-role', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.role === 'ADMIN') {
          setIsAdmin(true);
        } else {
          router.push('/unauthorized');
        }
      });
  }, [router]);

  if (!isAdmin) return <p className="p-4">Chargement...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className="bg-white p-6 shadow-lg rounded cursor-pointer hover:bg-gray-100"
          onClick={() => router.push('/admin/users')}
        >
          <h2 className="text-xl font-semibold">Utilisateurs</h2>
          <p className="text-gray-600">Gérer les comptes utilisateurs</p>
        </div>

        <div
          className="bg-white p-6 shadow-lg rounded cursor-pointer hover:bg-gray-100"
          onClick={() => router.push('/admin/hunts')}
        >
          <h2 className="text-xl font-semibold">Chasses</h2>
          <p className="text-gray-600">Gérer les chasses au trésor</p>
        </div>

        <div
          className="bg-white p-6 shadow-lg rounded cursor-pointer hover:bg-gray-100"
          onClick={() => router.push('/admin/reviews')}
        >
          <h2 className="text-xl font-semibold">Avis</h2>
          <p className="text-gray-600">Consulter les avis des joueurs</p>
        </div>
      </div>
    </div>
  );
}
