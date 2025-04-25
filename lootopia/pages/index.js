import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';  
import Image from 'next/image';  

export default function Home() {
  const router = useRouter();


  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between">
      <Navbar/>
        <main className="flex flex-col justify-center items-center flex-grow">
          <Image 
            src="/images/logo-lootopia.png" 
            alt="Lootopia Logo" 
            width={192} 
            height={192} 
            className="w-48 mb-8" 
          /> 
      </main>
    </div>
  );
}
