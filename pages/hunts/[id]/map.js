import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import 'leaflet/dist/leaflet.css';
import { useMapEvents } from 'react-leaflet';
import 'leaflet.smooth_marker_bouncing';
import L from 'leaflet';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });

const treasureCoords = { lat: 48.8966, lng: 2.2375 };

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
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

function MapClickHandler({ huntId }) {
  const winAudio = typeof Audio !== 'undefined' ? new Audio('/win.mp3') : null;
  const failAudio = typeof Audio !== 'undefined' ? new Audio('/fail.mp3') : null;

  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      const distance = haversineDistance(lat, lng, treasureCoords.lat, treasureCoords.lng).toFixed(2);

      if (distance < 0.05) {
        alert('🎉 Bravo ! Vous avez trouvé le trésor !');
        winAudio?.play();

        // ✅ Met à jour le statut en COMPLETED
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
        alert(`❌ Vous êtes à ${distance} km du trésor. Essayez encore !`);
        failAudio?.play();
      }
    },
  });

  return null;
}

export default function TreasureMapPage() {
  const markerRef = useRef(null);
  const router = useRouter();
  const { id: huntId } = router.query;

  // Bouncing + mise à jour du statut à l'ouverture
  useEffect(() => {
    if (markerRef.current && markerRef.current._leaflet_id) {
      markerRef.current.bounce({ duration: 1000, height: 100, loop: true });
    }

    // ✅ Mettre le statut en IN_PROGRESS quand on arrive sur la map
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

  return (
    <div className="h-screen w-full bg-black">
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
        <MapClickHandler huntId={huntId} />
      </MapContainer>
    </div>
  );
}
