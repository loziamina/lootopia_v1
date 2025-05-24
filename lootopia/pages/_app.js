// pages/_app.js
import { useEffect, useState } from 'react';
import '../styles/globals.css';
import Navbar from '../components/Navbar';

function MyApp({ Component, pageProps }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Vérifiez la présence du token dans localStorage lors du premier chargement
    const token = localStorage.getItem('token');
    setIsAuthenticated(token !== null);
  }, []);

  return (
    <div>
      <Navbar isAuthenticated={isAuthenticated} />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
