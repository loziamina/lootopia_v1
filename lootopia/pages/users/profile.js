import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login'); 
    } else {
      
      const fetchUser = async () => {
        try {
          const response = await axios.get('../api/users/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data); 
          setEmail(response.data.email);  
        } catch (err) {
          setError('Erreur lors de la récupération des données utilisateur.');
        }
      };
      fetchUser();
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await axios.put(
        '/api/profile',
        { email, password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Mot de passe mis à jour avec succès');
    } catch (err) {
      setError('Erreur lors de la mise à jour des informations.');
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Mon Profil</h1>
      {user ? (
        <div>
          <div className="mb-4">
            <p><strong>Email :</strong> {user.email}</p>
            <p><strong>ID :</strong> {user.id}</p>
          </div>

          <h2 className="text-xl font-semibold mb-4">Modifier mes informations</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Nouvel Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Nouveau Mot de Passe</label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Mettre à jour mes informations
            </button>
          </form>
        </div>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
}
