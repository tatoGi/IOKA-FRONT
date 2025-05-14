import Meta from "@/components/Meta/Meta";
import Layout from "@/components/Layout/Layout";
import Header from "@/components/Header/Header";
import "../styles/bootstrap.css";
import "../styles/globals.css";
import "../styles/fonts.css";
import "../styles/responsive.css";
import '../styles/404.css';
import Footer from "@/components/Footer/Footer";
import "leaflet/dist/leaflet.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's already imported
import { LoadingWrapper } from "@/components/LoadingWrapper/index";
import { SETTINGS_API } from "@/routes/apiRoutes";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

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
          <Component {...pageProps} />
        </Layout>
        <Footer navigationData={appData.navigationData} settings={appData.settings} />
      </div>
    </LoadingWrapper>
  );
}

export default App;