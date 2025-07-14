import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function CreateHuntPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    imageUrl: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post(`/api/admin/hunts/hunts`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      router.push('/admin/hunts');
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la création de la chasse');
    }
  };

  return (
    <div className="min-h-screen bg-[#1B1B1F] text-white py-12 px-4">
      <div className="max-w-3xl mx-auto bg-[#2A2A2E] p-8 rounded-xl shadow-lg border border-[#3E2C75]">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#F9C449]">🎯 Nouvelle chasse</h1>

        {error && <p className="text-red-500 mb-6 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
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
            ✅ Créer la chasse
          </button>
        </form>
      </div>
    </div>
  );
}
