import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/api/auth/forgot-password', { email });
      setSuccess('✅ Email vérifié. Redirection vers la réinitialisation...');
      setError('');
      setTimeout(() => {
        router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (err) {
      setError("❌ Adresse email introuvable ou erreur serveur.");
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B1B1F] to-[#2A2A2E] flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-[#251B47] text-center">🔐 Réinitialiser le mot de passe</h2>

        {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}
        {success && <div className="text-green-600 mb-4 text-sm">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-[#32A67F] focus:border-[#32A67F]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#32A67F] text-white rounded-md hover:bg-[#251B47] transition"
          >
            Vérifier mon email
          </button>
        </form>
      </div>
    </div>
  );
}
