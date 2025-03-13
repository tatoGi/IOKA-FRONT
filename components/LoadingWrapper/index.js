import { useRouter } from "next/router";
import { useEffect } from "react";
import { PuffLoader } from "react-spinners";
import LogoDark from "../../assets/img/ioka-logo-dark.png";
import Image from "next/image";

export function LoadingWrapper({ isLoading, children }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeStart = () => {
      if (document.getElementById("spinner"))
        document.getElementById("spinner").style.display = "flex";
    };

    const handleRouteChangeComplete = () => {
      if (document.getElementById("spinner"))
        document.getElementById("spinner").style.display = "none";
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    if (router.isReady) {
      if (document.getElementById("spinner"))
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
          flexDirection: "column",
          position: "fixed",
          top: "0",
          left: "0",
          height: "100%",
          width: "100%",
          zIndex: "999999",
          display: isLoading ? "flex" : "none", // Show spinner only when isLoading is true
          alignItems: "center",
          gap: 20,
          justifyContent: "center",
          background: "#fff",
        }}
      >
        <Image src={LogoDark} alt="logo" />
        <PuffLoader size={50} color="#049878" className="load-puff" />
      </div>
      {children}
    </>
  );
}