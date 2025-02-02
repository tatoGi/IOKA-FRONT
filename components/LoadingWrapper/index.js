import { useRouter } from "next/router";
import { useEffect } from "react";
import { PuffLoader } from "react-spinners";
// import logo from '../../assets/img/logo1.png';
import Image from "next/image";

export function LoadingWrapper({ Component }) {
    const router = useRouter();
  
    useEffect(() => {
      const handleRouteChangeStart = () => {
        if( document.getElementById("spinner"))
        document.getElementById("spinner").style.display = "flex";
      };
  
      const handleRouteChangeComplete = () => {
        if( document.getElementById("spinner"))
        document.getElementById("spinner").style.display = "none";
      };
  
      router.events.on("routeChangeStart", handleRouteChangeStart);
      router.events.on("routeChangeComplete", handleRouteChangeComplete);
  
      if (router.isReady) {
        if( document.getElementById("spinner"))
        document.getElementById("spinner").style.display = "none";
      }
  
      return () => {
        router.events.off("routeChangeStart", handleRouteChangeStart);
        router.events.off("routeChangeComplete", handleRouteChangeComplete);
      };
  
    }, [router]);
  
    return (
      <>
        <div
          id="spinner"
          style={{
            flexDirection:"column",
            position: "fixed",
            top: "0",
            left: "0",
            height: "100%",
            width: "100%",
            zIndex: "999999",
            display: "flex",
            alignItems: "center",
            gap: 20,
            justifyContent: "center",
            background: "#fff",
          }}
        >
          <Image src={logo} alt="logo"/>
          <PuffLoader size={50} color="#049878" className="load-puff" />
        </div>
        {Component}
      </>
    );
  }
  