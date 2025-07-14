import { useState } from 'react';

export default function ReviewForm({ huntId, onReviewAdded }) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // ✅ Récupère le token

    const res = await fetch(`/api/hunts/${huntId}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // ✅ Ajoute le token dans l'en-tête
      },
      body: JSON.stringify({ content }),
    });

    if (res.ok) {
      setContent('');
      const newReview = await res.json();
      onReviewAdded(newReview);
    } else {
      console.error('Erreur lors de l’envoi du commentaire');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Ajoutez un commentaire..."
        className="w-full p-2 border rounded"
        rows="3"
        required
      />
      <button type="submit" className="mt-2 px-4 py-2 bg-green-500 text-white rounded">
        Envoyer
      </button>
    </form>
  );
}
