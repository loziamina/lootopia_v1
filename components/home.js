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

    let userRole = null;

    fetch('/api/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then((data) => {
        setFirstName(data.firstName);
        userRole = data.role;

        if (userRole !== 'admin') {
          fetch('/api/admin/hunts/hunts', {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((res) => {
              if (!res.ok) throw new Error('Erreur serveur');
              return res.json();
            })
            .then((data) => {
              if (Array.isArray(data)) {
                setJoinedHunts(data);
              } else {
                setJoinedHunts([]);
              }
            })
            .catch(() => {
              setJoinedHunts([]);
            });
        } else {
          setJoinedHunts([]);
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
