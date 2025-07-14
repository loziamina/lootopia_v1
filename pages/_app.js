import { useEffect, useState } from 'react';
import '../styles/globals.css';
import Layout from '../components/Layout';
import 'leaflet/dist/leaflet.css';


function MyApp({ Component, pageProps }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(token !== null);
  }, []);


   return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
  
}

export default MyApp;
