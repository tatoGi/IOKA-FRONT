import Meta from "@/components/Meta/Meta";
import Layout from "@/components/Layout/Layout";
import Header from "@/components/Header/Header";
import "../styles/bootstrap.css";
import "../styles/globals.css";
import "../styles/fonts.css";
import "../styles/responsive.css";
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

function App({ Component, pageProps }) {
  const [navigationData, setNavigationData] = useState([]);
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

    fetchNavigationData();
  }, []);

  // Redirect to /home if statusCode is 404
  useEffect(() => {
    if (pageProps.statusCode === 404 && typeof window !== "undefined") {
      setIsRedirecting(true); // Set redirecting state to true
      router.push('/home').then(() => {
        setIsRedirecting(false); // Reset redirecting state after redirection
      });
    }
  }, [pageProps.statusCode, router]);

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
      <Footer />
    </>
  );
}

export default App;