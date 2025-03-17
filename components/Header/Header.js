// Header.js
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Logo from "../../assets/img/ioka-logo-white.png";
import LogoDark from "../../assets/img/ioka-logo-dark.png";
import Image from "next/image";
import SearchBtn from "../icons/SearchBtn";
import SearchCloseBtn from "../icons/SearchCloseBtn";
import { usePathname } from "next/navigation";

const Header = ({ navigationData, breadcrumbData }) => {
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

  // Find the page with type_id === 1 (Home page)
  const homePage = navigationData.find((page) => page.type_id === 1);

  // Determine the logo link based on whether a page with type_id === 1 exists
  const logoLink = homePage ? `/${homePage.slug}` : "/";
  return (
    <>
      <header className={activeScroll ? "scroll-header" : ""}>
        <div className="header-cont">
          <div className="container">
            <div className="header-box">
              <div className="left-cont-image">
                <div className="logo-img">
                  {/* Use the determined logo link */}
                  <Link href={logoLink} className="white-logo">
                    <Image src={Logo} alt="logo" width={138} height={42} />
                  </Link>
                  <Link href={logoLink} className="dark-logo">
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
     
    </>
  );
};

export default Header;