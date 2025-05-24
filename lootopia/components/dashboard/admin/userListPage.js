
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserListPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users/users');
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


  const promoteUser = async (id) => {
    try {
      await axios.post('/api/admin/users/promote', { id });
      fetchUsers();
    } catch (error) {
      console.error('Erreur lors de la promotion :', error);
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
              <th className="py-3 px-4">Actions</th>
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
                <td className="py-3 px-4 flex gap-2 justify-center">
                  {user.role !== 'ADMIN' && (
                    <button
                      onClick={() => promoteUser(user.id)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                    >
                      Promouvoir
                    </button>
                  )}
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
    </div>
  );
}
