import Meta from "@/components/Meta/Meta";
import Layout from "@/components/Layout/Layout";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import SharedLayout from "@/components/Layout/SharedLayout";
import { LoadingWrapper } from "@/components/LoadingWrapper/index";
import { SETTINGS_API } from "@/routes/apiRoutes";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { montserrat } from '../utils/fonts';

// Import styles in correct order
import "../styles/bootstrap.css";
import "../styles/fonts.css";
import "leaflet/dist/leaflet.css";  // Import Leaflet base styles first
import "../styles/leaflet.css";     // Then import our Leaflet overrides
import "../styles/globals.css";     // Then import global styles
import "../styles/responsive.css";
import '../styles/404.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

// Set Leaflet's image path
if (typeof window !== 'undefined') {
  window.L = require('leaflet');
  delete window.L.Icon.Default.prototype._getIconUrl;
  window.L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/images/marker-icon-2x.png',
    iconUrl: '/images/marker-icon.png',
    shadowUrl: '/images/marker-shadow.png',
  });
}

function App({ Component, pageProps }) {
  const [appData, setAppData] = useState({
    navigationData: [],
    settings: {},
    isLoading: true
  });
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [navigationRes, settingsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages`),
          fetch(SETTINGS_API)
        ]);

        const [navigationData, settingsData] = await Promise.all([
          navigationRes.json(),
          settingsRes.json()
        ]);

        setAppData({
          navigationData: navigationData.pages || [],
          settings: settingsData || {},
          isLoading: false
        });
      } catch (error) {
        console.error("Error fetching app data:", error);
        setAppData(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleStart = () => {
      setIsPageTransitioning(true);
      document.body.style.overflow = 'hidden';
    };
    
    const handleComplete = () => {
      setIsPageTransitioning(false);
      document.body.style.overflow = '';
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  const metaData = pageProps.meta || {};
  const isLoading = appData.isLoading || isPageTransitioning;

  return (
    <LoadingWrapper isLoading={isLoading}>
      <div style={{ 
        opacity: isLoading ? 0 : 1, 
        transition: 'opacity 0.3s ease-in-out',
        visibility: isLoading ? 'hidden' : 'visible'
      }}>
        <Meta {...metaData} />
        <Header navigationData={appData.navigationData} />
        <Layout>
          <SharedLayout>
            <main className={montserrat.variable}>
              <Component {...pageProps} />
            </main>
          </SharedLayout>
        </Layout>
        <Footer navigationData={appData.navigationData} settings={appData.settings} />
      </div>
    </LoadingWrapper>
  );
}

export default App;