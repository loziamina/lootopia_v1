import { useRouter } from 'next/router';

export default function HuntDetails({ hunt, onParticipate, isAdmin = false }) {
  const router = useRouter();

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-[#6B3FA0] to-[#A14CA0]">
      <h1 className="text-3xl font-bold mb-6 text-[#FAF7FF]">Détails de la chasse</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <p><strong>Titre :</strong> {hunt.title}</p>
        <p><strong>Description :</strong> {hunt.description || 'Aucune description'}</p>
        <p><strong>Lieu :</strong> {hunt.location || 'Non spécifié'}</p>
        <p><strong>Statut :</strong> {hunt.status}</p>
        <p><strong>Mode :</strong> {hunt.mode}</p>
        <p><strong>Organisateur :</strong> {hunt.createdBy?.email}</p>
        <p><strong>Début :</strong> {hunt.startDate ? new Date(hunt.startDate).toLocaleString() : 'Non défini'}</p>
        <p><strong>Fin :</strong> {hunt.endDate ? new Date(hunt.endDate).toLocaleString() : 'Non défini'}</p>
      </div>

      <div className="mt-6">
        {isAdmin && (
          <>
            <button
              onClick={() => router.push(`/admin/hunts/${hunt.id}/edit`)}
              className="bg-[#32A67F] text-white px-4 py-2 rounded hover:bg-[#251B47] transition"
            >
              Modifier la chasse
            </button>
            <button
              onClick={() => router.push('/admin/hunts')}
              className="ml-4 bg-[#251B47] text-white px-4 py-2 rounded hover:bg-[#3E2C75] transition"
            >
              Retour à la liste
            </button>
          </>
        )}

        <button
          onClick={onParticipate}
          className="ml-4 bg-[#251B47] text-white px-4 py-2 rounded hover:bg-[#3E2C75] transition"
        >
          Rejoindre la chasse
        </button>
      </div>
    </div>
  );
}
