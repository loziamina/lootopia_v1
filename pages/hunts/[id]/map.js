import dynamic from 'next/dynamic';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import 'leaflet/dist/leaflet.css';
import 'leaflet.smooth_marker_bouncing';

// Charger les composants de react-leaflet dynamiquement pour éviter les erreurs SSR
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
import { useMapEvents } from 'react-leaflet'; // Import statique pour useMapEvents

// Fonction pour générer des coordonnées aléatoires pour déplacer le trésor
const generateRandomCoords = () => {
  const lat = 48.8566 + (Math.random() - 0.5) * 0.1; // Déplacement autour de Paris
  const lng = 2.3522 + (Math.random() - 0.5) * 0.1; // Déplacement autour de Paris
  return { lat, lng };
};

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const treasureIcon = new L.Icon({
  iconUrl: '/coin.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

function MapClickHandler({ huntId, treasureCoords, setTreasureCoords }) {
  const winAudio = typeof Audio !== 'undefined' ? new Audio('/win.mp3') : null;
  const failAudio = typeof Audio !== 'undefined' ? new Audio('/fail.mp3') : null;

  // Utilisation de useMapEvents à l'intérieur du MapContainer
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      const distance = haversineDistance(lat, lng, treasureCoords.lat, treasureCoords.lng).toFixed(2);

      console.log(`Distance du trésor: ${distance} km`);

      if (distance < 0.05) {
        // Si le trésor est trouvé
        alert('🎉 Bravo ! Vous avez trouvé le trésor !');

        try {
          await winAudio?.play(); // Lecture du son de victoire
        } catch (err) {
          console.warn('🔇 Autoplay bloqué pour win.mp3 :', err);
        }

        // Déplacer le trésor
        const newCoords = generateRandomCoords();
        setTreasureCoords(newCoords); // Mise à jour des coordonnées du trésor

        const token = localStorage.getItem('token');
        if (token) {
          await fetch(`/api/participation/update-status`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ huntId, status: 'COMPLETED' }),
          });
        }
      } else {
        // Si le trésor n'est pas trouvé
        alert(`❌ Vous êtes à ${distance} km du trésor. Essayez encore !`);
        try {
          await failAudio?.play(); // Lecture du son d'échec
        } catch (err) {
          console.warn('🔇 Autoplay bloqué pour fail.mp3 :', err);
        }
      }
    },
  });

  return null;
}

export default function TreasureMapPage() {
  const markerRef = useRef(null);
  const router = useRouter();
  const { id: huntId } = router.query;
  const [treasureCoords, setTreasureCoords] = useState({ lat: 48.8966, lng: 2.2375 }); // État pour les coordonnées du trésor

  useEffect(() => {
    if (markerRef.current && markerRef.current._leaflet_id) {
      markerRef.current.bounce({ duration: 1000, height: 100, loop: true });
    }

    const token = localStorage.getItem('token');
    if (token && huntId) {
      fetch(`/api/participation/update-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ huntId, status: 'IN_PROGRESS' }),
      });
    }
  }, [huntId]);

  // Définir la fonction handleQuit à l'intérieur du composant
  const handleQuit = () => {
    router.push('/'); // Rediriger vers la page d'accueil (ou une autre page)
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      <div className="flex-1">
        <MapContainer
          center={[48.8566, 2.3522]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[treasureCoords.lat, treasureCoords.lng]}
            icon={treasureIcon}
            ref={markerRef}
          />
          <MapClickHandler huntId={huntId} treasureCoords={treasureCoords} setTreasureCoords={setTreasureCoords} />
        </MapContainer>
      </div>

      {/* Bouton pour quitter, avec z-index élevé pour le placer au-dessus de la carte */}
      <button
        onClick={handleQuit}
        className="bg-[#D24D79] text-white px-6 py-3 rounded-lg m-4 self-center"
      >
        Quitter
      </button>
    </div>
  );
}
