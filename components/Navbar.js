import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
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
        console.error("Erreur JWT :", err);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event("storage"));
    setIsAuthenticated(false);
    setUserRole(null);
    router.push('/auth/login');
  };

  return (
    <div className="flex flex-col gap-4 text-sm">
      <h1
        className="text-2xl font-bold mb-6 cursor-pointer hover:text-[#F9C449] transition"
        onClick={() => router.push('/')}
      >
        Lootopia
      </h1>

      {!isAuthenticated ? (
        <>
          <Link href="/auth/login" className="hover:text-[#D24D79]">Connexion</Link>
          <Link href="/auth/signup" className="hover:text-[#32A67F]">Inscription</Link>
        </>
      ) : (
        <>
          <Link href="/profile" className="hover:text-[#F9C449]">Mon Profil</Link>

          {userRole === 'ADMIN' && (
            <>
              <Link href="/admin/users" className="hover:text-[#D24D79]">Utilisateurs</Link>
              <Link href="/admin/hunts" className="hover:text-[#32A67F]">Chasses</Link>
            </>
          )}

          {userRole === 'USER' && (
            <>
              <Link href="/user/hunts" className="hover:text-[#F9C449]">Mes Chasses</Link>
            </>
          )}

          <button onClick={handleLogout} className="text-left hover:text-red-300">
            Déconnexion
          </button>
        </>
      )}
    </div>
  );
}
