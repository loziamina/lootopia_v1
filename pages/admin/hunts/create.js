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
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('location', form.location);
    formData.append('startDate', form.startDate);
    formData.append('endDate', form.endDate);
    if (image) formData.append('image', image); 

    try {
      await axios.post('/api/admin/hunts/hunts', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      router.push('/admin/hunts');
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la création de la chasse');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold mb-4 text-center text-[#251B47]">Créer une nouvelle chasse</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Titre"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded-md border-[#251B47] focus:ring-2 focus:ring-[#32A67F] transition"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-3 rounded-md border-[#251B47] focus:ring-2 focus:ring-[#32A67F] transition"
        />
        <input
          name="location"
          placeholder="Lieu"
          value={form.location}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded-md border-[#251B47] focus:ring-2 focus:ring-[#32A67F] transition"
        />
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          className="w-full border p-3 rounded-md border-[#251B47] focus:ring-2 focus:ring-[#32A67F] transition"
        />
        <input
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          className="w-full border p-3 rounded-md border-[#251B47] focus:ring-2 focus:ring-[#32A67F] transition"
        />
        
        <input
          type="file"
          name="image"
          onChange={handleImageChange}
          accept="image/png, image/jpg, image/jpeg"
          className="w-full border p-3 rounded-md border-[#251B47] focus:ring-2 focus:ring-[#32A67F] transition"
        />

        <button
          type="submit"
          className="w-full bg-[#32A67F] text-white p-3 rounded-md hover:bg-[#251B47] focus:ring-2 focus:ring-[#F9C449] transition"
        >
          Créer
        </button>
      </form>
    </div>
  );
}
