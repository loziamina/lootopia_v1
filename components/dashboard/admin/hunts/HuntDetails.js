import { useRouter } from 'next/router';

export default function HuntDetails({ hunt, onParticipate, isAdmin = false }) {
  const router = useRouter();

  return (
    <div className="p-8 min-h-screen bg-[#1A1A1A] text-white ml-64">
      <h1 className="text-3xl font-bold mb-6 text-[#F9C449]">🎯 Détails de la chasse</h1>

      <div className="bg-white text-black rounded-lg shadow-lg p-6 space-y-4">
        <p><strong>Titre :</strong> {hunt.title}</p>
        <p><strong>Description :</strong> {hunt.description || 'Aucune description'}</p>
        <p><strong>Lieu :</strong> {hunt.location || 'Non spécifié'}</p>
        <p><strong>Statut :</strong> {hunt.status}</p>
        <p><strong>Mode :</strong> {hunt.mode}</p>
        <p><strong>Organisateur :</strong> {hunt.createdBy?.email}</p>
        <p><strong>Début :</strong> {hunt.startDate ? new Date(hunt.startDate).toLocaleString() : 'Non défini'}</p>
        <p><strong>Fin :</strong> {hunt.endDate ? new Date(hunt.endDate).toLocaleString() : 'Non défini'}</p>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        {isAdmin && (
          <>
            <button
              onClick={() => router.push(`/admin/hunts/${hunt.id}/edit`)}
              className="bg-[#32A67F] hover:bg-[#26795E] text-white px-4 py-2 rounded transition"
            >
              ✏️ Modifier
            </button>
            <button
              onClick={() => router.push('/admin/hunts')}
              className="bg-[#6B3FA0] hover:bg-[#50317C] text-white px-4 py-2 rounded transition"
            >
              🔙 Retour à la liste
            </button>
          </>
        )}
        <button
          onClick={onParticipate}
          className="bg-[#D24D79] hover:bg-[#A8325C] text-white px-4 py-2 rounded transition"
        >
          🚀 Rejoindre la chasse
        </button>
      </div>
    </div>
  );
}
