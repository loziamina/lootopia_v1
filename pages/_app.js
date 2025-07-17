import { AuthProvider } from '../components/contexts/AuthContext'; // <--- ajoute ceci
import '../styles/globals.css';
import Layout from '../components/Layout';
import 'leaflet/dist/leaflet.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider> {/* Fournit le contexte à toute l'app */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}

export default MyApp;
