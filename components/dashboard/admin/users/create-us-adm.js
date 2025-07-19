import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function CreateUserAdminForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'USER',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post('/api/admin/users/create', form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      router.push('/admin/users');
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la création de l'utilisateur");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-[#1F1F1F] text-white rounded-lg shadow-lg mt-10 border border-[#3E2C75]">
      <h2 className="text-3xl font-bold mb-6 text-[#F9C449] text-center">
        Créer un utilisateur
      </h2>

      {error && (
        <p className="text-red-400 mb-4 text-center font-semibold">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          name="firstName"
          placeholder="Prénom"
          value={form.firstName}
          onChange={handleChange}
          className="w-full p-3 rounded bg-[#2A2A2A] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5C3E9E]"
          required
        />

        <input
          name="lastName"
          placeholder="Nom"
          value={form.lastName}
          onChange={handleChange}
          className="w-full p-3 rounded bg-[#2A2A2A] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5C3E9E]"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 rounded bg-[#2A2A2A] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5C3E9E]"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 rounded bg-[#2A2A2A] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5C3E9E]"
          required
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full p-3 rounded bg-[#2A2A2A] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5C3E9E]"
        >
          <option value="USER">Utilisateur</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button
          type="submit"
          className="w-full py-3 bg-[#F9C449] text-black font-semibold rounded hover:bg-[#D4A634] transition"
        >
          Créer l'utilisateur
        </button>
      </form>
    </div>
  );
}
