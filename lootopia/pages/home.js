import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/auth/login');  
    }
  }, []);

  const handleChaseClick = (chaseId) => {
    router.push(`/chase/${chaseId}`);  
  };

  return (
    <div className="min-h-screen bg-green-100">
      <div className="flex justify-between p-4 bg-green-700 text-white">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Bonjour Amina</h1>
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">PLAYER MODE</h2>
        <p className="text-2xl">Bienvenue dans Lootopia</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 p-4">
        <div
          className="bg-white p-4 rounded-lg shadow-md w-64 cursor-pointer hover:bg-gray-200"
          onClick={() => handleChaseClick(1)} 
        >
          <div className="text-center">
            <h3 className="text-xl font-semibold">Chasse 1</h3>
            <p>Amina LOZI - 12/10/2023</p>
          </div>
        </div>

        <div
          className="bg-white p-4 rounded-lg shadow-md w-64 cursor-pointer hover:bg-gray-200"
          onClick={() => handleChaseClick(2)} 
        >
          <div className="text-center">
            <h3 className="text-xl font-semibold">Chasse 2</h3>
            <p>Amina LOZI - 12/10/2023</p>
          </div>
        </div>
      </div>
    </div>
  );
}
