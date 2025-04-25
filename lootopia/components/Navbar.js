import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  const isAuthenticated = localStorage.getItem('token') !== null;

  return (
    <nav className="bg-gray-900 p-4 flex justify-between items-center text-white">
      <h1 className="text-2xl font-bold">Lootopia</h1>
      <div className="space-x-4">
        {!isAuthenticated && (
          <>
            <Link href="/auth/login" className="hover:text-purple-400">Connexion</Link>
            <Link href="/auth/signup" className="hover:text-purple-400">Inscription</Link>
          </>
        )}
      </div>
      <div>
        {isAuthenticated && (
          <button onClick={handleLogout} className="hover:text-purple-400">Déconnexion</button>
        )}
      </div>
    </nav>
  );
}
