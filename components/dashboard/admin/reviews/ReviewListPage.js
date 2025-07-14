import { useEffect, useState } from 'react';

export default function ReviewListPage({ huntId, newReview }) {
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [huntId, newReview]);

  const fetchReviews = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/hunts/${huntId}/review`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (Array.isArray(data)) {
        setReviews(data);
        setError('');
      } else {
        setReviews([]);
        setError('Impossible de charger les commentaires.');
      }
    } catch (err) {
      setError('Erreur réseau lors du chargement des commentaires.');
    }
  };

  const handleDelete = async (reviewId) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/hunts/${huntId}/review`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reviewId }),
    });
    fetchReviews();
  };

  const handleEdit = (review) => {
    setEditingId(review.id);
    setEditedContent(review.content);
  };

  const handleUpdate = async (reviewId) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/hunts/${huntId}/review`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reviewId, content: editedContent }),
    });

    if (res.ok) {
      setEditingId(null);
      fetchReviews();
    }
  };

  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;

  return (
    <div className="space-y-4 mt-6">
      {error && <p className="text-red-400 text-sm">{error}</p>}

      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-[#1F1F1F] text-white p-4 rounded-lg border border-[#3E2C75] shadow"
        >
          {editingId === review.id ? (
            <>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full p-3 rounded bg-[#2A2A2A] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5C3E9E]"
              />
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleUpdate(review.id)}
                  className="px-4 py-2 bg-[#F9C449] text-black rounded font-semibold hover:bg-[#D4A634] transition"
                >
                  Sauvegarder
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Annuler
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-base">{review.content}</p>
              <p className="text-sm text-gray-400 mt-1">
                Par <span className="text-[#F9C449]">{review.user.email}</span> —{' '}
                {new Date(review.createdAt).toLocaleString()}
              </p>
              {review.user.email === userEmail && (
                <div className="mt-2 flex gap-4">
                  <button
                    onClick={() => handleEdit(review)}
                    className="text-indigo-400 hover:text-indigo-200 text-sm"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
