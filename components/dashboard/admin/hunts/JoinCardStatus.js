import { useRouter } from 'next/router';

export default function JoinCardStatus({ joinedHunts }) {
  const router = useRouter();

  return (
    <section className="px-6 py-10 text-center bg-[#1A1A1A] text-white">

      {joinedHunts.length === 0 ? (
        <p className="text-xl text-gray-300">Tu n'as pas encore rejoint de chasse.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
          {joinedHunts.map((hunt) => (
            <div
              key={hunt.id}
              className="bg-[#2A2A2A] text-white rounded-lg shadow-md p-6 text-left border border-[#3E2C75]"
            >
              <h3 className="text-2xl font-bold mb-2 text-[#F9C449]">{hunt.title}</h3>
              <p className="mb-1 text-gray-300">
                <strong>Description :</strong> {hunt.description || 'Aucune description'}
              </p>
              <p className="mb-1 text-gray-300">
                <strong>Lieu :</strong> {hunt.location || 'Non précisé'}
              </p>

              <p className="mb-2 flex items-center gap-2">
                <strong className="text-gray-200">Statut :</strong>
                {hunt.status === 'IN_PROGRESS' && (
                  <span className="bg-green-600 text-white px-2 py-1 rounded text-sm">En cours 🟢</span>
                )}
                {hunt.status === 'COMPLETED' && (
                  <span className="bg-red-600 text-white px-2 py-1 rounded text-sm">Terminée 🔴</span>
                )}
                {hunt.status === 'PENDING' && (
                  <span className="bg-gray-500 text-white px-2 py-1 rounded text-sm">En attente ⚪</span>
                )}
              </p>

              <button
                onClick={async () => {
                  const token = localStorage.getItem('token');
                  if (token) {
                    try {
                      await fetch('/api/participation/update-status', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ huntId: hunt.id, status: 'PENDING' }),
                      });
                    } catch (err) {
                      console.error('Erreur mise à jour statut PENDING :', err);
                    }
                  }
                  router.push(`admin/hunts/${hunt.id}/`);
                }}
                className="mt-4 bg-[#5C3E9E] hover:bg-[#432B7D] text-white px-4 py-2 rounded transition duration-200"
              >
                Voir la chasse
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
