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
      const response = await axios.post('/api/auth/forgot-password', { email });
      setSuccess('Nous avons vérifié votre email. Vous pouvez maintenant réinitialiser votre mot de passe.');
      setError('');
      setTimeout(() => {
        router.push(`/auth/reset-password?email=${email}`);
      }, 2000);
    } catch (err) {
      setError('Erreur lors de la vérification de l\'email.');
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-4">Réinitialiser le mot de passe</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              required
            />
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">Vérifier mon email</button>
        </form>
      </div>
    </div>
  );
}
