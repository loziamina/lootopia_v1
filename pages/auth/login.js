import { useState, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { AuthContext } from '../../components/contexts/AuthContext'; // Contexte global

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const { login } = useContext(AuthContext); // Fonction login du contexte

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token } = response.data;

      login(token); // ⬅️ Met à jour le contexte + localStorage + role
      router.push('/'); // Redirige après login
    } catch (err) {
      setError('❌ Email ou mot de passe incorrect.');
      console.log('Erreur de connexion :', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B1B1F] to-[#2A2A2E] flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#251B47]">Connexion</h2>

        {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-[#32A67F] focus:border-[#32A67F] text-black"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-[#32A67F] focus:border-[#32A67F] text-black"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#32A67F] text-white rounded-md hover:bg-[#251B47] transition"
          >
            Se connecter
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/auth/forgot-password" passHref>
            <span className="text-sm text-[#32A67F] hover:underline cursor-pointer">
              Mot de passe oublié ?
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
