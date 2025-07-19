import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { AuthContext } from './contexts/AuthContext';
import { FaStar, FaArrowLeft } from 'react-icons/fa';
import Image from 'next/image';
import logo from '../public/images/logo-lootopia.png';

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated, userRole, logout } = useContext(AuthContext);
  const [firstName, setFirstName] = useState('');
  const [joinedHunts, setJoinedHunts] = useState([]);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const userRes = await fetch('/api/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!userRes.ok) throw new Error('Unauthorized');
        const userData = await userRes.json();
        setFirstName(userData.firstName || 'utilisateur');

        const huntsRes = await fetch('/api/users/hunts', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const huntsData = await huntsRes.json();
        setJoinedHunts(Array.isArray(huntsData) ? huntsData : []);
      } catch (error) {
        console.error('Erreur Navbar:', error);
        localStorage.removeItem('token');
        router.push('/auth/login');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-full text-white">
      {/* Haut */}
      <div>
        <div className="flex justify-center mb-2">
          <Image src={logo} alt="Lootopia Logo" width={80} height={80} className="rounded-full" />
        </div>

        {isAuthenticated && (
          <h2 className="text-center text-lg font-bold mb-6">
            Bienvenue {firstName.charAt(0).toUpperCase() + firstName.slice(1)}
          </h2>
        )}

        <nav className="space-y-3 font-semibold text-sm">
          {!isAuthenticated ? (
            <>
              <Link href="/auth/login" className="block hover:text-[#D24D79]">Connexion</Link>
              <Link href="/auth/signup" className="block hover:text-[#32A67F]">Inscription</Link>
            </>
          ) : (
            <>
              <Link href="/" className="block hover:text-[#F9C449]">Accueil</Link>
              {userRole === 'ADMIN' && (
                <>
                  <Link href="/admin/users" className="block hover:text-[#D24D79]">Utilisateurs</Link>
                  <Link href="/admin/hunts" className="block hover:text-[#32A67F]">Chasses</Link>
                </>
              )}
              {userRole === 'USER' && (
                <>
                  <Link href="/user/hunts" className="block hover:text-[#F9C449]">Mes chasses</Link>
                </>
              )}
              <Link href="/profile" className="block hover:text-[#F9C449]">Mon profil</Link>
            </>
          )}
        </nav>
      </div>

      {/* Bas */}
      {isAuthenticated && (
        <div className="mt-auto space-y-4">
         
          {/* Déconnexion */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-700 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
          >
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}
