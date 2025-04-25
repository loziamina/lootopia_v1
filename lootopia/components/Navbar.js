import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(token !== null); 

    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem('token');
      setIsAuthenticated(updatedToken !== null);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false); 
    router.push('/auth/login'); 
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
          <>
          <button onClick={handleLogout} className="hover:text-purple-400">Déconnexion</button>
          <a href="/users/profile" className="hover:text-purple-400">Mon Profil</a> 
          </>
        )}
      </div>
    </nav>
  );
}
