import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Logo from "../../assets/img/ioka-logo-white.png";
import LogoDark from "../../assets/img/ioka-logo-dark.png";
import Image from "next/image";
import SearchBtn from "../icons/SearchBtn";
import SearchCloseBtn from "../icons/SearchCloseBtn";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ subsets: ['latin'] });

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

    // Add/remove body scroll lock
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  useEffect(() => {
    // Set scroll-header immediately for non-home pages and don't add scroll listener
    if (!isHomePage && !isSearchPage) {
      setActiveScroll(true);
      return; // Exit early - no scroll listener needed for non-home pages
    }

    // Only add scroll listener for home page
    function handleScroll() {
      const currentScrollY = window.pageYOffset;

      // For home page, add scroll-header only when scrolling
      if (currentScrollY >= 20) {
        setActiveScroll(true);
      } else {
        setActiveScroll(false);
      }
    }

    // Initial check for home page
    handleScroll();

    // Add scroll listener only for home page
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage, isSearchPage]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 992);
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
      document.body.style.overflow = '';
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

  // Find contact page
  const contactPage = navigationData.find(page => page.type_id === 3 && page.active === 1);
  const contactSlug = contactPage ? `/${contactPage.slug}` : '/contact';

  // Only show pages with active === 1
  const desktopPages = navigationData.filter(page => page.active === 1 && page.type_id !== 3);
  const mobilePages = navigationData.filter(page => page.active === 1);

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
                    <Image
                      src={Logo}
                      alt="logo"
                      title="IOKA Logo"
                      width={138}
                      height={42}
                      priority={true}
                      loading="eager"
                      fetchPriority="high"
                    />
                  </div>
                  <div className="dark-logo">
                    <Image
                      src={LogoDark}
                      alt="logo"
                      title="IOKA Logo"
                      width={138}
                      height={42}
                      priority={true}
                      loading="eager"
                      fetchPriority="high"
                    />
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
              <div className={`header-nav ${isMobileView
                  ? (isMobileMenuOpen ? "active" : "")
                  : (isSearchOpen ? "shift-left" : "")
                }`}>
                <ul>
                  {isMobileView ? (
                    // Mobile view menu items
                    mobilePages.map((page) => (
                      <Link href={page.type_id === 6 ? '/blog' : `/${page.slug}`} key={page.id}>
                        <li
                          className={`mobile-menu-item ${normalizedPathname === `/${page.slug}`
                              ? "active-link"
                              : ""
                            }`}
                          style={{ padding: '20px 0', fontSize: '18px' }}
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



              <div className="right-search-contact" style={{ height: "42px" }}>
                <div className={`right-form ${isSearchOpen && !isMobileMenuOpen ? "active" : ""}`}>
                  <form onSubmit={handleSearch}>
                    <label
                      htmlFor="header-search"
                      className={`search-label ${isSearchOpen ? 'visible' : 'hidden'}`}
                    >
                    </label>
                    <input
                      id="header-search"
                      type="text"
                      ref={inputRef}
                      value={inputValue}
                      onChange={handleInputChange}
                      onFocus={() => setIsSearchOpen(true)}
                      placeholder={isSearchOpen ? "Search..." : ""}
                      aria-label="Search properties"
                    />
                    <button
                      type="submit"
                      className="searchbtn"
                      aria-label="Submit search"
                    >
                      <SearchBtn />
                    </button>
                    {isSearchOpen && (
                      <button
                        type="button"
                        className="clearbtn"
                        onClick={handleSearchToggle}
                        aria-label="Clear search"
                      >
                        <SearchCloseBtn />
                      </button>
                    )}
                  </form>
                </div>

                {/* Only show CONTACT US button if contact page exists and is active */}
                {contactPage && (
                  <div className="contactBtn">
                    <Link href={contactSlug}>CONTACT US</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={`header-nav mobile-nav ${isMobileView
            ? (isMobileMenuOpen ? "active" : "")
            : (isSearchOpen ? "shift-left" : "")
          }`}>
          <ul>
            {isMobileView ? (
              // Mobile view menu items
              mobilePages.map((page) => (
                <Link href={page.type_id === 6 ? '/blog' : `/${page.slug}`} key={page.id}>
                  <li
                    className={`mobile-menu-item ${normalizedPathname === `/${page.slug}`
                        ? "active-link"
                        : ""
                      }`}
                    style={{ padding: '20px 0', fontSize: '18px' }}
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
                  <Link href={page.type_id === 6 ? '/blog' : `/${page.slug}`}>{page.title}</Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </header>
    </>
  );
};

export default Header;
