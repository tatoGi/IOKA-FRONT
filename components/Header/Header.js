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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const pathname = usePathname();

  const normalizedPathname = pathname ? pathname.replace(/\/$/, "") : "";
  const isHomePage =
    normalizedPathname === "/" ||
    normalizedPathname === "/#" ||
    normalizedPathname === "/home";

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen); // Toggle mobile menu
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

    // Initial check to set the correct state based on the current scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const filteredAndSortedPages = navigationData
    .filter((page) => page.type_id !== 3 && page.active === 1)
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
              <div className="mobile-burger-menu" onClick={toggleMobileMenu}>
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
                  {filteredAndSortedPages.map((page) => (
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
