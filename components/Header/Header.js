import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Logo from "../../assets/img/ioka-logo-white.png";
import LogoDark from "../../assets/img/ioka-logo-dark.png";
import Image from "next/image";
import SearchBtn from "../icons/SearchBtn";
import SearchCloseBtn from "../icons/SearchCloseBtn";
import { usePathname } from "next/navigation";

const Header = ({ navigationData }) => {
  const [activeScroll, setActiveScroll] = useState(false);
  const pathname = usePathname();
  const normalizedPathname = pathname.replace(/\/$/, ""); // Normalize pathname
  const isHomePage = normalizedPathname === "/" || normalizedPathname === "/#"; // Check if it's the home page

  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      console.log("Searching for:", inputValue);
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setInputValue("");
    if (inputRef.current) {
      inputRef.current.focus();
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

    if (!isHomePage) {
      setActiveScroll(true);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  // Filter out the "Contact" page (type_id: 3) and sort the remaining pages by the "sort" column
  const filteredAndSortedPages = navigationData
    .filter((page) => page.type_id !== 3 && page.active === 1) // Exclude contact page and inactive pages
    .sort((a, b) => a.sort - b.sort); // Sort by the "sort" column

  // Find the current page based on the pathname
  const currentPage = navigationData.find((page) =>
    normalizedPathname.startsWith(`/${page.slug}`)
  );
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

  // Function to get breadcrumb path
  const getBreadcrumbPath = (path) => {
    const segments = path.split("/").filter((segment) => segment !== ""); // Split path into segments
    const breadcrumb = [];
    let currentPath = "";

    segments.forEach((segment) => {
      currentPath += `/${segment}`;
      const page = navigationData.find((page) => `/${page.slug}` === currentPath);
      if (page) {
        breadcrumb.push({ title: page.title, path: currentPath });
      }
    });

    return breadcrumb;
  };

  return (
    <>
      <header className={activeScroll ? "scroll-header" : ""}>
        <div className="header-cont">
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
                  {filteredAndSortedPages.map((page) => (
                    <li
                      key={page.id}
                      className={
                        normalizedPathname === `/${page.slug}` ? "active-link" : ""
                      }
                    >
                      <Link href={`/${page.slug}`}>{page.title}</Link>
                    </li>
                  ))}
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
                  {/* Link to the contact page (type_id: 3) */}
                  <Link href={"/contact"}>CONTACT US</Link>
                </div>
              </div>
              <div className="mobile-burger-menu">
                <div className="burger-lines"></div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Conditionally render the breadcrumb only if it's not the home page */}
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