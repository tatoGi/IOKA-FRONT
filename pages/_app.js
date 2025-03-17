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
import { useEffect, useState } from "react";
import Home from "@/pages/page-components/home";
function App({ Component, pageProps }) {
  
  const [navigationData, setNavigationData] = useState([]);

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
  if (pageProps.statusCode == 404 ) 
    return (
      <>
      <Meta />
      <Header navigationData={navigationData} />
      <Home />
      <Footer />
      </>
  );
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