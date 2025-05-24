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
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold mb-4 text-center">Modifier la chasse</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Titre"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="location"
          placeholder="Lieu"
          value={form.location}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
}
