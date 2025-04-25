import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Vérifier la présence du token dans le localStorage lors du premier chargement
    const token = localStorage.getItem('token');
    setIsAuthenticated(token !== null); // Si le token existe, l'utilisateur est connecté

    // Mettre à jour l'état si le token est modifié dans localStorage
    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem('token');
      setIsAuthenticated(updatedToken !== null);
    };

    // Ajouter un écouteur pour les changements dans le localStorage
    window.addEventListener('storage', handleStorageChange);

    // Nettoyer l'écouteur lors de la destruction du composant
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    // Supprimer le token du localStorage et mettre à jour l'état d'authentification
    localStorage.removeItem('token');
    setIsAuthenticated(false); // Mettre à jour l'état
    router.push('/auth/login'); // Rediriger vers la page de connexion
  };

  return (
    <nav className="bg-gray-900 p-4 flex justify-between items-center text-white">
      <h1 className="text-2xl font-bold">Lootopia</h1>
      <div className="space-x-4">
        {!isAuthenticated ? (
          <>
            <Link href="/auth/login" className="hover:text-purple-400">Connexion</Link>
            <Link href="/auth/signup" className="hover:text-purple-400">Inscription</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="hover:text-purple-400">Déconnexion</button>
        )}
      </div>
    </nav>
  );
}
