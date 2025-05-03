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
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LoadingWrapper } from "@/components/LoadingWrapper/index"; // Import LoadingWrapper
import { SETTINGS_API } from "@/routes/apiRoutes";

function App({ Component, pageProps }) {
  const [navigationData, setNavigationData] = useState([]);
  const [settings, setSettings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch navigation data from the API
    const fetchNavigationData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages`);
        const data = await res.json();
        setNavigationData(data.pages);
      } catch (error) {
        console.error("Error fetching navigation data:", error);
      }
    };

    // Fetch settings data from the API
    const fetchSettings = async () => {
      try {
        const res = await fetch(SETTINGS_API);
        const data = await res.json();
        setSettings(data);
      } catch (error) {
        console.error("Error fetching settings data:", error);
      }
    };

    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchNavigationData(), fetchSettings()]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Handle route change loading states
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

  // Get meta data from pageProps
  const metaData = pageProps.meta || {};

  if (isLoading || isPageTransitioning) {
    return <LoadingWrapper />;
  }

  return (
    <div style={{ visibility: isPageTransitioning ? 'hidden' : 'visible' }}>
      <Meta {...metaData} />
      <Header navigationData={navigationData} />
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Footer navigationData={navigationData} settings={settings} />
    </div>
  );
}

export default App;