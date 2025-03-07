// For production Image Optimization with Next.js, the optional 'sharp' package is strongly recommended.
// Run 'npm i sharp', and Next.js will use it automatically for Image Optimization.
// Read more: https://nextjs.org/docs/messages/sharp-missing-in-production

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Logo from "../../assets/img/ioka-logo-white.png";
import LogoDark from "../../assets/img/ioka-logo-dark.png";

import Image from "next/image";
import SearchBtn from "../icons/SearchBtn";
import SearchCloseBtn from "../icons/SearchCloseBtn";
import { usePathname } from "next/navigation";

const Header = () => {
  const [activeScroll, setActiveScroll] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/" || pathname === "/#";

  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  console.log(inputValue);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value); // Converts input into an array of letters
  };
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (inputValue.trim() !== "") {
      console.log("Searching for:", inputValue);
    }
  };
  const handleClear = (e) => {
    e.preventDefault(); // Prevent default form submission
    setInputValue(""); // Clear the input value
    if (inputRef.current) {
      inputRef.current.focus(); // Focus back on the input field
    }
  };

  useEffect(() => {
    function handleScroll() {
      if (!isHomePage) {
        setActiveScroll(true);
        return;
      }

      const currentScrollY = window.pageYOffset;
      if (currentScrollY >= 20) {
        setActiveScroll(true);
      } else {
        setActiveScroll(false);
      }
    }

    // Set initial state
    if (!isHomePage) {
      setActiveScroll(true);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  // Update the getBreadcrumbTitle function to handle page-components paths
  const getBreadcrumbTitle = (path) => {
    if (!path) return "";
    const segments = path.split("/");
    // Handle page-components paths
    if (segments.includes("page-components")) {
      const lastSegment = segments[segments.length - 1];
      switch (lastSegment) {
        case "developer":
          return "Developers";
        case "about":
          return "About Us";
        case "contact":
          return "Contact Us";
        default:
          return lastSegment
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
      }
    }
    // Handle other paths
    const lastSegment = segments[segments.length - 1];
    switch (lastSegment) {
      case "offplan":
        return "Offplan";
      case "resale":
        return "Resale";
      case "rentals":
        return "Rentals";
      case "blog":
        return "Blog";
      default:
        return lastSegment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
    }
  };

  return (
    <>
      <header className={activeScroll ? "scroll-header" : ""}>
        <div className="header-cont">
          {/* home-header  classNme after check*/}
          <div className="container">
            <div className="header-box">
              <div className="left-cont-image">
                <div className="logo-img">
                  <Link href={"/#"} className="white-logo">
                    <Image src={Logo} alt="logo" width={138} height={42} />
                  </Link>
                  <Link href={"/#"} className="dark-logo">
                    <Image src={LogoDark} alt="logo" width={138} height={42} />
                  </Link>
                </div>
              </div>
              <div className="header-nav">
                <ul>
                  <li
                    className={
                      pathname === "/page-components/offplan"
                        ? "active-link"
                        : ""
                    }
                  >
                    <Link href={"/page-components/offplan"}>OFFPLAN</Link>
                  </li>
                  <li className={pathname === "/resale" ? "active-link" : ""}>
                    <Link href={"/resale"}>RESALE</Link>
                  </li>
                  <li className={pathname === "/rentals" ? "active-link" : ""}>
                    <Link href={"/rentals"}>RENTALS</Link>
                  </li>
                  <li
                    className={
                      pathname === "/page-components/developer"
                        ? "active-link"
                        : ""
                    }
                  >
                    <Link href={"/page-components/developer"}>DEVELOPERS</Link>
                  </li>
                  <li className={pathname === "/blog" ? "active-link" : ""}>
                    <Link href={"/blog"}>BLOG</Link>
                  </li>
                  <li
                    className={
                      pathname === "/page-components/about" ? "active-link" : ""
                    }
                  >
                    <Link href={"/page-components/about"}>ABOUT US</Link>
                  </li>
                </ul>
              </div>
              <div className="right-search-contact">
                <div className="right-form">
                  <form action="">
                    <input
                      type="text"
                      ref={inputRef}
                      value={inputValue}
                      onChange={handleInputChange}
                    />
                    <button className="searchbtn" onClick={handleSearch}>
                      <SearchBtn />
                    </button>
                    <button className="clearbtn" onClick={handleClear}>
                      <SearchCloseBtn />
                    </button>
                  </form>
                </div>
                <div className="contactBtn">
                  <Link href={"/page-components/contact"}>CONTACT US</Link>
                </div>
              </div>
              <div className="mobile-burger-menu">
                <div className="burger-lines"></div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {!isHomePage && (
        <div className="breadcrumb-section">
          <div className="container">
            <div className="breadcrumb-content">
              <ul className="breadcrumb-list">
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>{getBreadcrumbTitle(pathname)}</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
