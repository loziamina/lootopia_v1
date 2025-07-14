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
    <div className="p-8 min-h-screen bg-[#1B1B1F] text-white">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#F9C449]">👥 Gestion des utilisateurs</h1>

      <div className="mb-6 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Rechercher par email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 bg-[#2B2B30] text-white border border-[#5C3E9E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A892FE]"
        />
      </div>

      <div className="overflow-x-auto bg-[#2A2A2E] rounded-lg shadow-lg">
        <table className="min-w-full">
          <thead className="bg-[#3E2C75] text-white">
            <tr>
              <th className="py-3 px-4 text-left">Nom</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Rôle</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-t border-[#444] hover:bg-[#3A2D58] transition">
                <td className="py-3 px-4">{user.firstName} {user.lastName}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-white text-sm ${user.role === 'ADMIN' ? 'bg-[#32A67F]' : 'bg-[#5C3E9E]'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-4 flex gap-2 justify-center items-center">
                  <select
                    value={user.role}
                    onChange={(e) => changeUserRole(user.id, e.target.value)}
                    className="text-sm px-2 py-1 bg-[#252525] text-white border border-[#5C3E9E] rounded"
                  >
                    <option value="USER">Utilisateur</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="px-3 py-1 bg-[#D24D79] hover:bg-[#F9C449] text-white text-sm font-semibold rounded transition"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-400">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={() => router.push('/admin/users/create')}
          className="bg-[#5C3E9E] text-white px-5 py-2 rounded hover:bg-[#7C5FC3] transition"
        >
          + Ajouter un utilisateur
        </button>
      </div>
    </div>
  );
}
