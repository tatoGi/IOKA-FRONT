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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const pathname = usePathname();
  const router = useRouter(); // Initialize router

  const normalizedPathname = pathname ? pathname.replace(/\/$/, "") : "";
  const isHomePage =
    normalizedPathname === "/" ||
    normalizedPathname === "/#" ||
    normalizedPathname === "/home";
  
  const isSearchPage = normalizedPathname === "/search";

  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  // Add new state for mobile view
  const [isMobileView, setIsMobileView] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (inputValue.trim() !== "") {
      router.push({
        pathname: "/search",
        query: { query: inputValue.trim() }, // Use query object for consistency
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen); // Toggle mobile menu
  };

  useEffect(() => {
    function handleScroll() {
      // Search page: never have scroll-header
      if (!isSearchPage) {
        setActiveScroll(true);
        return;
      }
      if (isSearchPage) {
        const currentScrollY = window.pageYOffset;
        setActiveScroll(currentScrollY >= 20);
        return;
      }
      // Home page: add scroll-header only when scrolling
      if (isHomePage) {
        const currentScrollY = window.pageYOffset;
        setActiveScroll(currentScrollY >= 20);
        return;
      }

      // Other pages: always have scroll-header
      setActiveScroll(true);
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

  const desktopPages = navigationData
    .filter((page) => page.type_id !== 3 && page.active === 1)
    .sort((a, b) => a.sort - b.sort);

  const mobilePages = navigationData
    .filter((page) => page.active === 1)
    .sort((a, b) => a.sort - b.sort);

  const currentPage = navigationData.find((page) =>
    normalizedPathname.startsWith(`/${page.slug}`)
  );

  const homePage = navigationData.find((page) => page.type_id === 1);
  const logoLink = homePage ? `/${homePage.slug}` : "/";

  return (
    <>
      <header className={activeScroll ? "scroll-header" : ""}>
        <div className="header-cont">
          <div className="container">
            <div className="header-box">
              <div className="left-cont-image">
                <div className="logo-img">
                  <Link href={logoLink} className="white-logo">
                    <Image src={Logo} alt="logo" width={138} height={42} />
                  </Link>
                  <Link href={logoLink} className="dark-logo">
                    <Image src={LogoDark} alt="logo" width={138} height={42} />
                  </Link>
                </div>
              </div>

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
              <div className={`header-nav ${isMobileMenuOpen ? "active" : ""}`}>
                <ul>
                  {isMobileView
                    ? mobilePages.map((page) => (
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
                    : desktopPages.map((page) => (
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
                      ))}
                </ul>
              </div>

              <div className="right-search-contact" style={{ height: "42px" }}> {/* Adjust height */}
                <div className="right-form">
                  <form onSubmit={handleSearch}>
                    <input
                      type="text"
                      ref={inputRef}
                      value={inputValue}
                      onChange={handleInputChange}
                    />
                    <button type="submit" className="searchbtn">
                      <SearchBtn />
                    </button>
                    <button
                      type="button"
                      className="clearbtn"
                      onClick={handleClear}
                    >
                      <SearchCloseBtn />
                    </button>
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
