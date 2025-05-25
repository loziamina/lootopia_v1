import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function ProfileComponent() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [mission, setMission] = useState('');
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
          setFirstName(response.data.firstName);
          setLastName(response.data.lastName);
          setAddress(response.data.address || '');
          setMission(response.data.mission || '');
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
      await axios.put(
        '../api/users/profile',
        { email, firstName, lastName, address, mission },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Informations mises à jour avec succès');
    } catch (err) {
      setError('Erreur lors de la mise à jour des informations.');
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <div className="w-24 h-24 bg-indigo-200 rounded-full flex justify-center items-center text-4xl text-white shadow">
            👤
          </div>
          <div className="ml-6">
            <h1 className="text-2xl font-bold text-gray-800">{user ? `${user.firstName} ${user.lastName}` : 'Utilisateur'}</h1>
            <p className="text-sm text-gray-600">Email : {user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="border p-2 rounded" placeholder="Email" />
          <input name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="border p-2 rounded" placeholder="Prénom" />
          <input name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="border p-2 rounded" placeholder="Nom" />
          <input name="address" value={address} onChange={(e) => setAddress(e.target.value)} className="border p-2 rounded" placeholder="Adresse" />
          <input name="mission" value={mission} onChange={(e) => setMission(e.target.value)} className="border p-2 rounded" placeholder="Mission" />

          <div className="col-span-full mt-4 flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-600 space-x-2">
              <FaMapMarkerAlt className="text-green-600" />
              <span>{address || 'Adresse non renseignée'}</span>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Mettre à jour</button>
          </div>
        </form>

        <div className="mt-6 text-sm text-gray-600 flex items-center space-x-2">
          <span>Lien vers le profil :</span>
          <a className="text-blue-500 underline" href={`https://www.lootopia.com/${user?.email}`} target="_blank" rel="noreferrer">https://www.lootopia.com/{user?.email}</a>
          <button onClick={() => navigator.clipboard.writeText(`https://www.lootopia.com/${user?.email}`)} className="ml-2 px-3 py-1 bg-green-500 text-white rounded">Copier</button>
        </div>

        <div className="mt-6 flex space-x-4">
          <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">Modifier mon profil</button>
          <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Supprimer mon profil</button>
        </div>
      </div>
    </div>);
}