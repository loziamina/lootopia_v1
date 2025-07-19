import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (!token) {
      setError('❌ Le lien de réinitialisation est invalide ou a expiré.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      await axios.post('/api/auth/reset-password', { token, newPassword });
      setSuccess('✅ Mot de passe réinitialisé avec succès. Redirection...');
      setError('');

      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la réinitialisation du mot de passe.');
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B1B1F] to-[#2A2A2E] flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#251B47]">🔒 Réinitialisation</h2>

        {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}
        {success && <div className="text-green-600 mb-4 text-sm">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-[#32A67F] focus:border-[#32A67F]"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-[#32A67F] focus:border-[#32A67F]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#32A67F] text-white rounded-md hover:bg-[#251B47] transition"
          >
            Réinitialiser le mot de passe
          </button>
        </form>
      </div>
    </div>
  );
}
