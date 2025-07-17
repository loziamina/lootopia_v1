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
  const [loading, setLoading] = useState(true);  
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
          setLoading(false);  // Set loading to false once data is fetched
        } catch (err) {
          setError('Erreur lors de la récupération des données utilisateur.');
          setLoading(false);  // Set loading to false on error
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
        '../api/users/profile', // Utiliser la même API pour la mise à jour du profil
        { email, firstName, lastName, address }, // Envoie uniquement les données à jour
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Informations mises à jour avec succès');
    } catch (err) {
      setError('Erreur lors de la mise à jour des informations.');
    }
  };

  // Fonction de suppression du profil
  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vous devez être connecté pour supprimer votre profil.');
      return;
    }

    try {
      const response = await axios.delete('../api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Votre profil a été supprimé avec succès.');
      router.push('/auth/login'); // Rediriger l'utilisateur vers la page de connexion
    } catch (err) {
      setError('Erreur lors de la suppression du profil.');
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) return <div>{error}</div>;

  return (
    <div className="bg-[#1A1A1A] text-white ">
      <div className="bg-white text-black p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <div className="w-24 h-24 bg-[#6B3FA0] rounded-full flex justify-center items-center text-4xl text-white shadow-inner">
            👤
          </div>
          <div className="ml-6">
            <h1 className="text-2xl font-bold">{user ? `${user.firstName} ${user.lastName}` : 'Utilisateur'}</h1>
            <p className="text-sm text-gray-600">Email : {user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="border p-2 rounded border-gray-300" placeholder="Email" />
          <input name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="border p-2 rounded border-gray-300" placeholder="Prénom" />
          <input name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="border p-2 rounded border-gray-300" placeholder="Nom" />
          <input name="address" value={address} onChange={(e) => setAddress(e.target.value)} className="border p-2 rounded border-gray-300" placeholder="Adresse" />
          <div className="col-span-full mt-4 flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-700 space-x-2">
              <FaMapMarkerAlt className="text-[#32A67F]" />
              <span>{address || 'Adresse non renseignée'}</span>
            </div>
            <button className="bg-[#6B3FA0] text-white px-4 py-2 rounded hover:bg-[#432B7D] transition">Mettre à jour</button>
          </div>
        </form>

        <div className="mt-6 text-sm text-gray-700 flex items-center space-x-2">
          <span>Lien vers le profil :</span>
          <a className="text-[#6B3FA0] underline" href={`https://www.lootopia.com/${user?.email}`} target="_blank" rel="noreferrer">
            https://www.lootopia.com/{user?.email}
          </a>
          <button onClick={() => navigator.clipboard.writeText(`https://www.lootopia.com/${user?.email}`)} className="ml-2 px-3 py-1 bg-[#D24D79] text-white rounded">
            Copier
          </button>
        </div>

        <div className="mt-6 flex space-x-4">
          <button className="px-4 py-2 bg-[#F9C449] text-black rounded hover:bg-[#251B47] hover:text-white">Modifier mon profil</button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-[#D24D79] text-white rounded hover:bg-[#F9C449] hover:text-black"
          >
            Supprimer mon profil
          </button>
        </div>
      </div>
    </div>
  );
}
