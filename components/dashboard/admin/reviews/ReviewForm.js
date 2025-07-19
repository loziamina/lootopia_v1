import { useState } from 'react';

export default function ReviewForm({ huntId, onReviewAdded = () => {} }) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token manquant. Utilisateur non connecté.');
      return;
    }

    try {
      const res = await fetch(`/api/hunts/${huntId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        setContent('');
        const newReview = await res.json();

        if (typeof onReviewAdded === 'function') {
          onReviewAdded(newReview);
        }
      } else {
        console.error('Erreur lors de l’envoi du commentaire');
      }
    } catch (error) {
      console.error('Erreur réseau lors de l’envoi du commentaire', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#1A1A1A] p-4 rounded-lg shadow border border-[#3E2C75]">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Ajoutez un commentaire..."
        className="w-full p-3 rounded bg-[#2A2A2A] text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C3E9E]"
        rows="4"
        required
      />
      <button
        type="submit"
        className="mt-3 bg-[#F9C449] text-black px-6 py-2 rounded hover:bg-[#D4A634] transition font-semibold"
      >
        Envoyer
      </button>
    </form>
  );
}
