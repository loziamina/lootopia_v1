import { useState, useEffect } from 'react';
import axios from 'axios';
import HuntSearch from './HuntSearch';
import HuntTable from './HuntTable';

export default function HuntListPage() {
  const [hunts, setHunts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchHunts();
  }, []);

  const fetchHunts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/hunts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHunts(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des chasses :', error);
    }
  };

  const deleteHunt = async (id) => {
    const confirmDelete = confirm('Confirmer la suppression de cette chasse ?');
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/hunts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHunts(hunts.filter((hunt) => hunt.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
    }
  };

  const viewHunt = (id) => {
    window.location.href = `/admin/hunts/${id}`; 
  };

  const editHunt = (id) => {
    window.location.href = `/admin/hunts/${id}/edit`; 
  };

  const filteredHunts = hunts.filter((hunt) =>
    hunt.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 min-h-screen bg-[#1A1A1A] text-white ml-64">
      <h1 className="text-3xl font-bold mb-6 text-[#F9C449] text-center">
        📜 Liste des Chasses
      </h1>

      <HuntSearch search={search} setSearch={setSearch} />

      <HuntTable
        hunts={filteredHunts}
        onDelete={deleteHunt}
        onView={viewHunt}
        onEdit={editHunt}
      />
    </div>
  );
}
