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
  const isContactPage = pathname === "/page-components/contact";

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
  // useEffect(() => {
  //   if (props.type_id === sectionTypes.home) {
  //     setClassN(true)
  //   } else {
  //     setClassN(false)
  //   }
  // }, [localRouter, props.type_id])

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.pageYOffset;
      if (currentScrollY >= 20 || isContactPage) {
        setActiveScroll(true);
      } else {
        setActiveScroll(false);
      }
    }

    // Set initial state for contact page
    if (isContactPage) {
      setActiveScroll(true);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isContactPage]);

  return (
    <header className={activeScroll ? "scroll-header" : ""}>
      <div className="header-cont">
        {" "}
        {/* home-header  classNme after check*/}
        <div className="container">
          <div className="header-box">
            <div className="left-cont-image">
              <div className="logo-img">
                <Link href={"/#"} className="white-logo">
                  <Image src={Logo} alt="logo" />
                </Link>
                <Link href={"/#"} className="dark-logo">
                  <Image src={LogoDark} alt="logo" />
                </Link>
              </div>
            </div>
            <div className="header-nav">
              <ul>
                <li className="active-link">
                  <Link href={"#"}>OFFPLAN</Link>
                </li>
                <li>
                  <Link href={"#"}>RESALE</Link>
                </li>
                <li>
                  <Link href={"#"}>RENTALS</Link>
                </li>
                <li>
                  <Link href={"#"}>DEVELOPERS</Link>
                </li>
                <li>
                  <Link href={"#"}>BLOG</Link>
                </li>
                <li>
                  <Link href={"#"}>ABOUT US</Link>
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
  );
};

export default Header;
