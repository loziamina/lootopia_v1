import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FaMapMarkerAlt } from 'react-icons/fa'; // Pour l'icône de localisation

export default function Profile() {
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

  // Gérer la soumission du formulaire pour mettre à jour les informations
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await axios.put(
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
        {/* Section profil */}
        <div className="flex items-center mb-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex justify-center items-center">
            {/* Avatar de l'utilisateur */}
            <div className="text-4xl text-gray-600">👤</div>
          </div>
          <div className="ml-6">
            <h1 className="text-2xl font-bold text-gray-800">{user ? `${user.firstName} ${user.lastName}` : 'Nom de l\'utilisateur'}</h1>
            <p className="text-sm text-gray-600">Nom d'utilisateur : {user?.email}</p>
          </div>
        </div>

        {/* Formulaire pour mettre à jour les informations */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Prénom */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Prénom</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Adresse */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Adresse</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>

            {/* Mission */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Mission</label>
              <input
                type="text"
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Bouton de mise à jour */}
          <div className="mt-6 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FaMapMarkerAlt className="text-green-600" />
              <span className="text-sm text-gray-600">{address || 'Adresse non renseignée'}</span>
            </div>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Mettre à jour
            </button>
          </div>
        </form>

        {/* Lien vers le profil et bouton copier */}
        <div className="mt-6 flex items-center space-x-2">
          <p className="text-sm text-gray-600">Lien vers le profil de {user?.firstName} :</p>
          <span className="text-blue-500">https://www.lootopia.com/{user?.email}</span>
          <button
            className="ml-2 py-1 px-3 bg-green-500 text-white rounded-md"
            onClick={() => navigator.clipboard.writeText(`https://www.lootopia.com/${user?.email}`)}
          >
            Copier le lien
          </button>
        </div>

        {/* Modifier et supprimer le profil */}
        <div className="mt-6 flex space-x-4">
          <button className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">Modifier mon profil</button>
          <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Supprimer mon profil</button>
        </div>
      </div>
    </div>
  );
}
