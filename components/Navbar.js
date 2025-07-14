import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { jwtDecode } from 'jwt-decode';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
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
    localStorage.removeItem('token');
    window.dispatchEvent(new Event("storage"));
    setIsAuthenticated(false);
    setUserRole(null);
    router.push('/auth/login');
  };

  return (
    <nav className="bg-[#6B3FA0] px-6 py-4 flex justify-between items-center text-[#FAF7FF] shadow-md">
      <h1
        className="text-3xl font-bold cursor-pointer hover:text-[#F9C449] transition"
        onClick={() => router.push('/')}
      >
        Lootopia
      </h1>

      <div className="space-x-4 text-sm font-medium hidden md:flex">
        {!isAuthenticated ? (
          <>
            <Link href="/auth/login" className="hover:text-[#D24D79] transition">Connexion</Link>
            <Link href="/auth/signup" className="hover:text-[#32A67F] transition">Inscription</Link>
          </>
        ) : (
          <>
            <Link href="/profile" className="hover:text-[#F9C449] transition">Mon Profil</Link>

            {userRole === 'ADMIN' && (
              <>
                <Link href="/admin/users" className="hover:text-[#D24D79] transition">Utilisateurs</Link>
                <Link href="/admin/hunts" className="hover:text-[#32A67F] transition">Chasses</Link>
                <Link href="/admin/reviews" className="hover:text-[#3E2C75] transition">Avis</Link>
              </>
            )}

            {userRole === 'USER' && (
              <>
                <Link href="/user/hunts" className="hover:text-[#F9C449] transition">Mes Chasses</Link>
                <Link href="/user/participate" className="hover:text-[#3E2C75] transition">Avis</Link>

              </>
            )}

            <button
              onClick={handleLogout}
              className="hover:text-red-300 transition"
            >
              Déconnexion
            </button>
          </>
        )}
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="block md:hidden"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-16 right-0 bg-[#6B3FA0] text-[#FAF7FF] shadow-md rounded-lg p-4 w-48">
          {!isAuthenticated ? (
            <>
              <Link href="/auth/login" className="block py-2">Connexion</Link>
              <Link href="/auth/signup" className="block py-2">Inscription</Link>
            </>
          ) : (
            <>
              <Link href="/profile" className="block py-2">Mon Profil</Link>
              {userRole === 'ADMIN' && (
                <>
                  <Link href="/admin/users" className="block py-2">Utilisateurs</Link>
                  <Link href="/admin/hunts" className="block py-2">Chasses</Link>
                  <Link href="/admin/reviews/" className="block py-2">Avis</Link>
                </>
              )}
              {userRole === 'USER' && (
                <Link href="users/hunts" className="block py-2">Mes Chasses</Link>
              )}
              <button
                onClick={handleLogout}
                className="block py-2"
              >
                Déconnexion
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
