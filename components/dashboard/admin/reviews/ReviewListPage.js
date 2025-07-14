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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (Array.isArray(data)) {
        setReviews(data);
        setError('');
      } else {
        console.error('Données inattendues :', data);
        setReviews([]);
        setError('Impossible de charger les commentaires.');
      }
    } catch (err) {
      console.error('Erreur réseau :', err);
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

  const userEmail =
    typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}

      {Array.isArray(reviews) &&
        reviews.map((review) => (
          <div key={review.id} className="p-3 bg-gray-100 rounded shadow">
            {editingId === review.id ? (
              <>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => handleUpdate(review.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded"
                  >
                    Sauvegarder
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1 bg-gray-400 text-white rounded"
                  >
                    Annuler
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-700">{review.content}</p>
                <p className="text-xs text-gray-500">
                  Par {review.user.email} le{' '}
                  {new Date(review.createdAt).toLocaleString()}
                </p>
                {review.user.email === userEmail && (
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() => handleEdit(review)}
                      className="text-blue-500 text-sm"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="text-red-500 text-sm"
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
