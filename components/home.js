import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

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

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-[#FAF7FF]">
      <div className="flex justify-between p-6 bg-[#432B7D] text-white shadow-md rounded-b-lg">
        <h1 className="text-3xl font-bold">Bienvenue {firstName} 👋</h1>
      </div>

      <section className="px-6 py-10 text-center">
        <h2 className="text-4xl font-semibold mb-6 text-[#F9C449]">Aventure en cours...</h2>
        <p className="text-xl mb-8">Tu n'as pas encore rejoint de chasse, mais les aventures t'attendent !</p>
      </section>
    </div>
  );
}
