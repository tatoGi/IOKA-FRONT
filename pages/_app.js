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
  const [isRedirecting, setIsRedirecting] = useState(false); // State to track redirection
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

    fetchNavigationData();
    fetchSettings();
  }, []);

 

  // If redirecting, show LoadingWrapper
  if (isRedirecting) {
    return <LoadingWrapper />; // Show loading state while redirecting
  }

  return (
    <>
      <Meta />
      <Header navigationData={navigationData} />
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Footer navigationData={navigationData} settings={settings} />
    </>
  );
}

export default App;