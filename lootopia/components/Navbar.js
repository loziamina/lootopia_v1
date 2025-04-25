import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-900 p-4 flex justify-between items-center text-white">
      <h1 className="text-2xl font-bold">Lootopia</h1>
      <div className="space-x-4">
        <Link href="../auth/login" className="hover:text-purple-400">Connexion</Link>
        <Link href="../auth/signup" className="hover:text-purple-400">Inscription</Link>
      </div>
    </nav>
  );
}
