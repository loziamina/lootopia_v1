import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

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
      setSuccess("Inscription réussie. Redirection vers la connexion...");
      setError('');

      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err) {
      setError("Erreur lors de l'inscription. Vérifiez vos informations.");
      setSuccess('');
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B1B1F] to-[#2A2A2E] flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-4 text-center text-[#251B47]">Créer un compte</h2>

        {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}
        {success && <div className="text-green-600 mb-4 text-sm">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Prénom"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border p-2 rounded-md border-gray-300 focus:ring-[#32A67F] focus:border-[#32A67F]"
            required
          />
          <input
            type="text"
            placeholder="Nom"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border p-2 rounded-md border-gray-300 focus:ring-[#32A67F] focus:border-[#32A67F]"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded-md border-gray-300 focus:ring-[#32A67F] focus:border-[#32A67F]"
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded-md border-gray-300 focus:ring-[#32A67F] focus:border-[#32A67F]"
            required
          />
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border p-2 rounded-md border-gray-300 focus:ring-[#32A67F] focus:border-[#32A67F]"
            required
          />

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
