import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem('token');
      setIsAuthenticated(token !== null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false); // Mettre à jour l'état après déconnexion
    router.push('/auth/login');
  };

  return (
    <nav className="bg-gray-900 p-4 flex justify-between items-center text-white">
      <h1 className="text-2xl font-bold"><a href='/home'>Lootopia</a></h1>
      <div className="space-x-4">
        {!isAuthenticated ? (
          <>
            <Link href="/auth/login" className="hover:text-purple-400">Connexion</Link>
            <Link href="/auth/signup" className="hover:text-purple-400">Inscription</Link>
          </>
        ) : (
          <>
          <button onClick={handleLogout} className="hover:text-purple-400">Déconnexion</button>
          <a href="/users/profile" className="hover:text-purple-400">Mon Profil</a> 
          </>
        )}
      </div>
    </nav>
  );
}
