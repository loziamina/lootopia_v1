import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Home from '../components/home';  

export default function HomePage() {
  const router = useRouter();


  return (
          <Home/>
  );
}
