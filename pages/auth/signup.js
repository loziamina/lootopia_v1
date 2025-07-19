import { useState, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { AuthContext } from '../../components/contexts/AuthContext';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await axios.post('/api/auth/signup', {
        email, password, firstName, lastName,
      });

      const { token } = response.data;
      login(token);
      router.push('/');
    } catch (err) {
      setError("Erreur lors de l'inscription. Vérifiez vos informations.");
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B1B1F] to-[#2A2A2E] flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#251B47]">Créer un compte</h2>

        {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Prénom</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-[#32A67F] focus:border-[#32A67F] text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-[#32A67F] focus:border-[#32A67F] text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-[#32A67F] focus:border-[#32A67F] text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-[#32A67F] focus:border-[#32A67F] text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-[#32A67F] focus:border-[#32A67F] text-black"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#32A67F] text-white rounded-md hover:bg-[#251B47] transition"
          >
            S'inscrire
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Déjà un compte ?{' '}
          <Link href="/auth/login" className="text-[#32A67F] hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
