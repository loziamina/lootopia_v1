export default function JoinCardStatus({ joinedHunts }) {
    return (
      <section className="px-6 py-10 text-center">
        <h2 className="text-4xl font-semibold mb-6 text-[#F9C449]">Aventures en cours...</h2>

        {joinedHunts.length === 0 ? (
          <p className="text-xl mb-8">Tu n'as pas encore rejoint de chasse.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
            {joinedHunts.map((hunt) => (
              <div key={hunt.id} className="bg-white text-black rounded-lg shadow p-6 text-left">
                <h3 className="text-2xl font-bold mb-2">{hunt.title}</h3>
                <p className="mb-1"><strong>Description :</strong> {hunt.description || 'Aucune description'}</p>
                <p className="mb-1"><strong>Lieu :</strong> {hunt.location || 'Non précisé'}</p>

                <p className="mb-1 flex items-center">
                  <strong className="mr-2">Statut :</strong>
                  {hunt.status === 'IN_PROGRESS' && (
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">En cours 🟢</span>
                  )}
                  {hunt.status === 'COMPLETED' && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">Terminée 🔴</span>
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

                    router.push(`/hunts/${hunt.id}/participate`);
                  }}
                  className="mt-4 bg-[#432B7D] text-white px-4 py-2 rounded hover:bg-[#5C3E9E] transition"
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