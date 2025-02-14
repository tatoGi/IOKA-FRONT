import Meta from "@/components/Meta/Meta";
import Layout from "@/components/Layout/Layout";
import Header from "@/components/Header/Header";
import "../styles/bootstrap.css";
import "../styles/globals.css";
import "../styles/fonts.css";
import "../styles/responsive.css";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Footer from "@/components/Footer/Footer";
import "leaflet/dist/leaflet.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

function App({ Component, pageProps }) {
  // const [metaTitle, setMetaTitle] = useState("");

  // let headerMenu;
  // let footerMenu;
  // let homeSLug;
  // let upperFooterMenu;

  // if (!pageProps.menu) {
  //   return null;
  // }

  // upperFooterMenu = pageProps.menu.filter((x) =>
  //   x.menu_types.includes("Upper Header")
  // );
  // headerMenu = pageProps.menu.filter((x) => x.menu_types.includes("header"));
  // footerMenu = pageProps.menu.filter((x) => x.menu_types.includes("footer"));
  // homeSLug = pageProps.menu.filter((item) => item.type_id === 1);

  // const image = useMemo(() => {
  //   let file = false;
  //   if (pageProps.page?.sluggable) {
  //     if(pageProps?.page?.sluggable?.gallery && pageProps?.page?.sluggable?.gallery[0]?.file){
  //        file = pageProps?.page?.sluggable?.gallery[0]?.file
  //     }else if(pageProps?.page?.sluggable?.image && pageProps?.page?.sluggable?.image?.file){
  //       file = pageProps?.page?.sluggable?.image?.file;
  //     }else  if(pageProps?.page?.sluggable?.section_cover?.file){
  //       file = pageProps?.page?.sluggable?.section_cover?.file;
  //     }
  //       // .sort((a, b) => a.sort - b.sort)[0]?.file;

  //     return  file === false ? '/img/logo2.png' : `${process.env.NEXT_PUBLIC_IMAGE_URL}${file}`;
  //   }
  // }, [pageProps.page]);

  // useEffect(() => {
  //   if (pageProps.page && !pageProps.page.slugs) {
  //      setMetaTitle(pageProps.page[locale]?.sluggable?.title);
  //     const slugArray = Object.values(pageProps.page).map(localeData => {
  //       return {
  //         locale: localeData.slugs[0].locale,
  //         slug: localeData.slugs[0].slug
  //       };
  //     });
  //     setStaticPageLang(slugArray);
  //   }
  // }, [pageProps.page]);
  return (
    <>
      <Meta />
      <Header />
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Footer />
    </>
  );
}
export default App;
