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
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Créer un utilisateur ou admin</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="firstName" placeholder="Prénom" value={form.firstName} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="lastName" placeholder="Nom" value={form.lastName} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="password" type="password" placeholder="Mot de passe" value={form.password} onChange={handleChange} className="w-full border p-2 rounded" required />
        <select name="role" value={form.role} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="USER">Utilisateur</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Créer</button>
      </form>
    </div>
  );
}
