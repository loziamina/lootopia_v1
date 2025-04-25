import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';  

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/auth/login');  
    }
  }, []);

  return (
    <div className="min-h-screen bg-green-100">
      <div className="flex justify-between p-4 bg-green-700 text-white">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Bonjour Amina</h1>
        </div>
        <div className="flex items-center">
          <button className="text-red-600 hover:text-red-400">Déconnexion</button>
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">PLAYER MODE</h2>
        <p className="text-2xl">Bienvenue dans Lootopia</p>
      </div>
      <div className="flex flex-wrap justify-center gap-4 p-4">
        {/* Cartes des chasses */}
        <div className="bg-white p-4 rounded-lg shadow-md w-64">
          <Image 
            src="/images/cartetresor1.jpg"  // Mis à jour de .png à .jpg
            alt="Carte au trésor 1" 
            width={192} 
            height={192} 
            className="w-48 mb-8" 
          />           
          <p>Amina LOZI  - 12/10/2023</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md w-64">
          <Image 
            src="/images/cartetresor2.jpg"  // Mis à jour de .png à .jpg
            alt="Carte au trésor 2" 
            width={192} 
            height={192} 
            className="w-48 mb-8" 
          /> 
          <p>Amina LOZI- 12/10/2023</p>
        </div>
      </div>
    </div>
  );
}
