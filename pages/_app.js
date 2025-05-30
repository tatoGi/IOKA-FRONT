import Meta from "@/components/Meta/Meta";
import Layout from "@/components/Layout/Layout";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import SharedLayout from "@/components/Layout/SharedLayout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { montserrat } from '../utils/fonts';
import "nprogress/nprogress.css";
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
    settings: { meta: [] }
  });
  const [currentPageMeta, setCurrentPageMeta] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [navigationRes, settingsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`)
        ]);
        
        const [navigationData, settingsData] = await Promise.all([
          navigationRes.json(),
          settingsRes.json()
        ]);

        // Transform settings data into the expected structure
        const transformedSettings = {
          meta: settingsData.meta || [],
          footer: settingsData.footer || [],
          social: settingsData.social || []
        };
        
        setAppData(prevAppData => ({
          ...prevAppData,
          navigationData: navigationData.pages || [],
          settings: transformedSettings
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
        setAppData(prev => ({ ...prev }));
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (router.isReady && appData.navigationData && appData.navigationData.length > 0) {
      const pathWithoutQuery = router.asPath.split('?')[0];
      const currentSlug = pathWithoutQuery === '/' ? 'IOKA' : pathWithoutQuery.replace(/^\//, '');

      const currentPageData = appData.navigationData.find(page => page.slug === currentSlug);

      if (currentPageData && currentPageData.metadata) {
        const apiMeta = currentPageData.metadata;
        const transformedMeta = {
          title: apiMeta.meta_title,
          keywords: apiMeta.meta_keywords,
          description: apiMeta.meta_description,
          og_title: apiMeta.og_title,
          og_description: apiMeta.og_description,
          og_image: apiMeta.og_image,
          twitter_card: apiMeta.twitter_card,
          twitter_title: apiMeta.twitter_title,
          twitter_description: apiMeta.twitter_description,
          twitter_image: apiMeta.twitter_image,
        };
        
        Object.keys(transformedMeta).forEach(key => {
          if (transformedMeta[key] === undefined || transformedMeta[key] === null) {
            delete transformedMeta[key];
          }
        });
        setCurrentPageMeta(transformedMeta);
      } else {
        setCurrentPageMeta({});
      }
    }
  }, [router.asPath, router.isReady, appData.navigationData]);



  const globalMeta = appData.settings?.meta || [];
  const pageMeta = currentPageMeta;

  const pageMetaArray = Object.keys(pageMeta).map(key => ({
    key: key,
    value: pageMeta[key]
  }));

  const finalMetaItems = [...globalMeta];
  pageMetaArray.forEach(pageItem => {
    const index = finalMetaItems.findIndex(globalItem => globalItem.key === pageItem.key);
    if (index !== -1) {
      finalMetaItems[index] = pageItem;
    } else {
      finalMetaItems.push(pageItem);
    }
  });
  const TopProgressBar = dynamic(
    () => {
      return import("@/components/TopProgressBar/TopProgressBar");
    },
    { ssr: true },
  );
  return (
    <div>
      <Meta items={finalMetaItems} />
      <Header navigationData={appData.navigationData} />
      <Layout>
        <SharedLayout>
          <main className={montserrat.variable}>
            <TopProgressBar />
            <Component {...pageProps} />
          </main>
        </SharedLayout>
      </Layout>
      <Footer navigationData={appData.navigationData} settings={appData.settings} />
    </div>
  );
}

export default App;