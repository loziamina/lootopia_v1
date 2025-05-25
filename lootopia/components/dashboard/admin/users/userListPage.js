import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';


export default function UserListPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('/api/admin/users/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs :', error);
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = confirm('Es-tu sûr de vouloir supprimer cet utilisateur ?');
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/admin/users/${id}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((u) => u.id !== id));
    } catch (error) {
      console.error('Erreur suppression utilisateur :', error);
      alert("Une erreur est survenue lors de la suppression.");
    }
  };

  const changeUserRole = async (id, newRole) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        `/api/admin/users/${id}/role`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUsers();
    } catch (error) {
      console.error('Erreur lors du changement de rôle :', error);
      alert("Impossible de changer le rôle de l'utilisateur.");
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Liste des utilisateurs</h1>

      <div className="mb-6 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Rechercher par email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Nom</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Rôle</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50 transition">
                <td className="py-3 px-4">{user.firstName} {user.lastName}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-white text-sm ${user.role === 'ADMIN' ? 'bg-green-600' : 'bg-gray-500'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-4 flex gap-2 justify-center items-center">
                  <select
                    value={user.role}
                    onChange={(e) => changeUserRole(user.id, e.target.value)}
                    className="text-sm px-2 py-1 border border-gray-300 rounded-md"
                  >
                    <option value="USER">Utilisateur</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">Aucun utilisateur trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mb-6">
  <button
    onClick={() => router.push('/admin/users/create')}
    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
  >
    + Créer un utilisateur
  </button>
</div>
    </div>
    
  );
}
