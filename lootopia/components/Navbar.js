import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { jwtDecode } from 'jwt-decode'; 

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      try {
        const decoded = jwtDecode(token); 
        setUserRole(decoded.role); 
      } catch (err) {
        console.error("Erreur de décodage du JWT :", err);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.setItem('token', token);
    window.dispatchEvent(new Event("storage"));
    setIsAuthenticated(false);
    setUserRole(null);
    router.push('/auth/login');
  };

  return (
    <nav className="bg-gray-900 p-4 flex justify-between items-center text-white">
      <h1 className="text-2xl font-bold cursor-pointer" onClick={() => router.push('/home')}>
        Lootopia
      </h1>
      <div className="space-x-4">
        {!isAuthenticated ? (
          <>
            <Link href="/auth/login" className="hover:text-purple-400">Connexion</Link>
            <Link href="/auth/signup" className="hover:text-purple-400">Inscription</Link>
          </>
        ) : (
          <>
            <Link href="/users/profile" className="hover:text-purple-400">Mon Profil</Link>
            {userRole === 'ADMIN' && (
              <>
                <Link href="/admin/users/" className="hover:text-purple-400">Utilisateurs</Link>
                <Link href="/admin/hunts/" className="hover:text-purple-400">Chasses</Link>
                <Link href="/admin/reviews/" className="hover:text-purple-400">Avis</Link>
              </>
            )}
            <button onClick={handleLogout} className="hover:text-purple-400">Déconnexion</button>
          </>
        )}
      </div>
    </nav>
  );
}
