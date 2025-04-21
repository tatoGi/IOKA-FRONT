import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Logo from "../../assets/img/ioka-logo-white.png";
import LogoDark from "../../assets/img/ioka-logo-dark.png";
import Image from "next/image";
import SearchBtn from "../icons/SearchBtn";
import SearchCloseBtn from "../icons/SearchCloseBtn";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router"; // Import useRouter

const Header = ({ navigationData }) => {
  const [activeScroll, setActiveScroll] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  const normalizedPathname = pathname ? pathname.replace(/\/$/, "") : "";
  const homePage = navigationData.find((page) => page.type_id === 1);
  const isHomePage = normalizedPathname === "/" || 
                    normalizedPathname === "/#" || 
                    (homePage && normalizedPathname === `/${homePage.slug}`);
  
  const isSearchPage = normalizedPathname === "/search";

  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  const [isMobileView, setIsMobileView] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      router.push({
        pathname: "/search",
        query: { query: inputValue.trim() },
      });
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setInputValue("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSearchToggle = (e) => {
    e.stopPropagation();
    if (isMobileMenuOpen) {
      setIsSearchOpen(false);
      return;
    }
    setIsSearchOpen(prev => !prev);
    if (!isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setInputValue("");
    }
  };

  const toggleMobileMenu = (e) => {
    e.stopPropagation();
    setIsMobileMenuOpen(prev => !prev);
    setIsSearchOpen(false); // Ensure search is closed when mobile menu is opened
  };
  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.pageYOffset;
      
      // Always add scroll-header when scrolling down on any page
      if (currentScrollY >= 20) {
        setActiveScroll(true);
      } else {
        // Only remove scroll-header when at top if not on a regular page
        if (!(!isHomePage && !isSearchPage)) {
          setActiveScroll(false);
        }
      }
    }

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage, isSearchPage]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Close the mobile menu when the route changes
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false);
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSearchOpen && 
          !event.target.closest('.right-form') && 
          !event.target.closest('.searchbtn')) {
        setIsSearchOpen(false);
        setInputValue("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  const desktopPages = navigationData
    .filter((page) => page.type_id !== 3 && page.active === 1)
    .sort((a, b) => a.sort - b.sort);

  const mobilePages = navigationData
    .filter((page) => page.active === 1)
    .sort((a, b) => a.sort - b.sort);

  const currentPage = navigationData.find((page) =>
    normalizedPathname.startsWith(`/${page.slug}`)
  );

  const logoLink = homePage ? `/${homePage.slug}` : "/";

  return (
    <>
      <header className={activeScroll ? "scroll-header" : ""}>
        <div className="header-cont">
          <div className="container">
            <div className="header-box">
            <Link href={logoLink} className="logo-img">
              <div className="left-cont-image">
               
                  <div className="white-logo">
                    <Image src={Logo} alt="logo" width={138} height={42} priority />
                  </div>
                  <div className="dark-logo">
                    <Image src={LogoDark} alt="logo" width={138} height={42} />
                  </div>
                
              </div>
              </Link>
              {/* Mobile Burger Menu */}
              <div
                className="mobile-burger-menu"
                style={{ height: "42px", alignSelf: "center" }} // Adjust height and alignment
                onClick={toggleMobileMenu}
              >
                <div
                  className={`burger-lines ${isMobileMenuOpen ? "open" : ""}`}
                >
                  <div className="burger-line"></div>
                  <div className="burger-line"></div>
                  <div className="burger-line"></div>
                </div>
              </div>

              {/* Navigation Menu */}
              <div className={`header-nav ${
  isMobileView 
    ? (isMobileMenuOpen ? "active" : "") 
    : (isSearchOpen ? "shift-left" : "")
}`}>
  <ul>
    {isMobileView ? (
      // Mobile view menu items
      mobilePages.map((page) => (
        <Link href={`/${page.slug}`} key={page.id}>
          <li
            className={
              normalizedPathname === `/${page.slug}`
                ? "active-link"
                : ""
            }
          >
            <span>{page.title}</span>
          </li>
        </Link>
      ))
    ) : (
      // Desktop view menu items
      desktopPages.map((page) => (
        <li
          key={page.id}
          className={
            normalizedPathname === `/${page.slug}`
              ? "active-link"
              : ""
          }
        >
          <Link href={`/${page.slug}`}>{page.title}</Link>
        </li>
      ))
    )}
  </ul>
</div>

              <div className="right-search-contact" style={{ height: "42px" }}> {/* Adjust height */}
              <div className={`right-form ${isSearchOpen && !isMobileMenuOpen ? "active" : ""}`}>
                  <form onSubmit={handleSearch}>
                    <input
                      type="text"
                      ref={inputRef}
                      value={inputValue}
                      onChange={handleInputChange}
                      onFocus={() => setIsSearchOpen(true)}
                      placeholder={isSearchOpen ? "Search..." : ""}
                    />
                    <button 
                      type="submit" 
                      className="searchbtn"
                    >
                      <SearchBtn />
                    </button>
                    {isSearchOpen && (
                      <button
                        type="button"
                        className="clearbtn"
                        onClick={handleSearchToggle}
                      >
                        <SearchCloseBtn />
                      </button>
                    )}
                  </form>
                </div>

                <div className="contactBtn">
                  <Link href={"/contact"}>CONTACT US</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
