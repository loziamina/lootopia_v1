import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function EditHuntPage() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    imageUrl: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchHunt = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/admin/hunts/${id}/hunt`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const hunt = res.data;
        setForm({
          title: hunt.title || '',
          description: hunt.description || '',
          location: hunt.location || '',
          startDate: hunt.startDate?.substring(0, 10) || '',
          endDate: hunt.endDate?.substring(0, 10) || '',
        });
      } catch (err) {
        console.error('Erreur de chargement :', err);
        setError('Erreur lors du chargement de la chasse.');
      }
    };

    fetchHunt();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.put(`/api/admin/hunts/${id}/hunt`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      router.push('/admin/hunts');
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la mise à jour.');
    }
  };

  return (
    <div className="min-h-screen bg-[#1B1B1F] text-white py-12 px-4">
      <div className="max-w-3xl mx-auto bg-[#2A2A2E] p-8 rounded-xl shadow-lg border border-[#3E2C75]">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#F9C449]">📝 Modifier la chasse</h1>

        {error && <p className="text-red-500 mb-6 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="title"
            placeholder="Titre de la chasse"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-md bg-[#1B1B1F] border border-[#251B47] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#32A67F]"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 rounded-md bg-[#1B1B1F] border border-[#251B47] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#32A67F]"
          />
          <input
            type="text"
            name="location"
            placeholder="Lieu"
            value={form.location}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-md bg-[#1B1B1F] border border-[#251B47] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#32A67F]"
          />
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-[#1B1B1F] border border-[#251B47] text-white focus:outline-none focus:ring-2 focus:ring-[#32A67F]"
            />
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-[#1B1B1F] border border-[#251B47] text-white focus:outline-none focus:ring-2 focus:ring-[#32A67F]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#32A67F] hover:bg-[#251B47] text-white p-3 rounded-md text-lg font-semibold transition focus:ring-2 focus:ring-[#F9C449]"
          >
            💾 Enregistrer les modifications
          </button>
        </form>
      </div>
    </div>
  );
}
