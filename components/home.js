import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import JoinCardStatus from '@/components/dashboard/admin/hunts/JoinCardStatus';

export default function Home() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [joinedHunts, setJoinedHunts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetch('/api/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then((data) => {
        setFirstName(data.firstName);
        const userRole = data.role;

        // ADMIN → nouvelle route API
        if (userRole === 'ADMIN') {
          fetch('/api/admin/hunts/with-status', {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((res) => {
              if (!res.ok) throw new Error('Erreur serveur');
              return res.json();
            })
            .then((data) => {
              setJoinedHunts(Array.isArray(data) ? data : []);
            })
            .catch(() => {
              setJoinedHunts([]);
            });
        } else {
          // USER → comportement inchangé
          fetch('/api/users/hunts', {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((res) => {
              if (!res.ok) throw new Error('Erreur serveur');
              return res.json();
            })
            .then((data) => {
              setJoinedHunts(Array.isArray(data) ? data : []);
            })
            .catch(() => {
              setJoinedHunts([]);
            });
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        router.push('/auth/login');
      });
  }, []);

  return (
    <div className="flex flex-col gap-4 text-sm">
      <h2 className="text-4xl font-semibold mb-6 text-purple-400">Aventures en cours</h2>
      <JoinCardStatus joinedHunts={joinedHunts} />
    </div>
  );
}
