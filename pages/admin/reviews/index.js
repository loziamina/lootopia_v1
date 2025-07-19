import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('/api/admin/reviews/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReviews(res.data);
      } catch (err) {
        console.error('Erreur chargement des reviews', err);
      }
    };
    fetchReviews();
  }, []);

  const deleteReview = async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`/api/admin/reviews/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setReviews(reviews.filter(r => r.id !== id));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Gestion des Reviews</h1>
      {reviews.map((r) => (
        <div key={r.id} className="bg-white p-4 rounded shadow mb-4">
          <p><strong>Utilisateur :</strong> {r.user.email}</p>
          <p><strong>Chasse :</strong> {r.hunt.title}</p>
          <p><strong>Note :</strong> {r.rating}/5</p>
          <p><strong>Commentaire :</strong> {r.comment}</p>
          <button
            onClick={() => deleteReview(r.id)}
            className="mt-2 text-red-600 underline"
          >
            Supprimer
          </button>
        </div>
      ))}
    </div>
  );
}
