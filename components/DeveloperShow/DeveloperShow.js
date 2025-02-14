import React, { useState, useRef } from "react";
import styles from "./DeveloperShow.module.css";
import Image from "next/image";
import EmaarLogo from "../../assets/img/Shape.png";
import { FiSearch } from "react-icons/fi";
import DeveloperImage from "../../assets/img/developerimg.png";
import AreaVector from "../../assets/img/areavector.png";
import BathroomIcon from "../../assets/img/bathroom.png";
import BedroomIcon from "../../assets/img/Vector2.png";
import WarehouseIcon from "../../assets/img/warehousevector.png";
import { HiOutlineMail } from "react-icons/hi";
import { BsWhatsapp } from "react-icons/bs";
import agentInfo from "../../assets/img/agentinfo.png";
import callVector from "../../assets/img/callvector.png";
import SubscribeSection from "../SubscribeSection/SubscribeSection";
import filterVector from "../../assets/img/filtervector.png";
import awardimg1 from "../../assets/img/awardimg1.png";
import awardsicon from "../../assets/img/awardsicon.png";
import Slider from "react-slick";

/**
 * DeveloperShow Component
 * Displays detailed information about a property developer including:
 * - Search and filter functionality
 * - Developer information
 * - Property listings (Off-plan and Resale)
 * - Awards section
 */
const DeveloperShow = () => {
  // State for managing different sliders
  const [currentSlide, setCurrentSlide] = useState(0); // Controls off-plan properties slider
  const [resaleCurrentSlide, setResaleCurrentSlide] = useState(0); // Controls resale properties slider
  const [awardCurrentSlide, setAwardCurrentSlide] = useState(0); // Controls awards slider

  // Touch interaction states
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Mouse drag interaction states
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Refs for accessing slider DOM elements
  const sliderRef = useRef(null);
  const resaleSliderRef = useRef(null);
  const awardSliderRef = useRef(null);

  // Sample data arrays for sliders
  const propertySlides = [1, 2, 3, 4, 5]; // Off-plan property slides
  const resaleSlides = [1, 2, 3, 4, 5]; // Resale property slides
  const awardSlides = [1, 2, 3]; // Award slides

  /**
   * Handles the start of touch interaction
   * @param {TouchEvent} e - Touch event object
   */
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  /**
   * Tracks touch movement for slider interaction
   * @param {TouchEvent} e - Touch event object
   */
  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  /**
   * Processes the end of touch interaction and determines slide direction
   * Swipe threshold is 75px
   */
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left - next slide
      setCurrentSlide((prev) => Math.min(prev + 1, resaleSlides.length - 1));
    }

    if (touchStart - touchEnd < -75) {
      // Swipe right - previous slide
      setCurrentSlide((prev) => Math.max(prev - 1, 0));
    }
  };

  // Touch handlers specifically for resale slider
  const handleResaleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleResaleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleResaleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left
      setResaleCurrentSlide((prev) =>
        Math.min(prev + 1, resaleSlides.length - 1)
      );
    }

    if (touchStart - touchEnd < -75) {
      // Swipe right
      setResaleCurrentSlide((prev) => Math.max(prev - 1, 0));
    }
  };

  /**
   * Handles mouse down event for drag scrolling
   * @param {MouseEvent} e - Mouse event object
   */
  const handleResaleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - resaleSliderRef.current.offsetLeft);
    setScrollLeft(resaleSliderRef.current.scrollLeft);
  };

  /**
   * Handles mouse movement during drag
   * Calculates scroll position based on drag distance
   * @param {MouseEvent} e - Mouse event object
   */
  const handleResaleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - resaleSliderRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Multiply by 2 for faster scrolling
    resaleSliderRef.current.scrollLeft = scrollLeft - walk;
  };

  /**
   * Handles the end of mouse drag interaction
   * Snaps to the nearest slide based on current scroll position
   */
  const handleResaleMouseUp = () => {
    setIsDragging(false);
    const slideWidth = 1200 + 24; // card width + gap
    const currentScroll = resaleSliderRef.current.scrollLeft;
    const nearestSlide = Math.round(currentScroll / slideWidth);
    setResaleCurrentSlide(nearestSlide);
  };

  // Touch handlers for awards slider
  const handleAwardTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
    setTouchEnd(e.touches[0].clientX); // Reset touchEnd
  };

  const handleAwardTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
    // Prevent page scroll
    e.preventDefault();
  };

  const handleAwardTouchEnd = () => {
    const swipeDistance = touchStart - touchEnd;

    if (Math.abs(swipeDistance) > 50) {
      // Reduced threshold for easier sliding
      if (swipeDistance > 0 && awardCurrentSlide < 2) {
        // Swipe left
        setAwardCurrentSlide((prev) => prev + 1);
      }
      if (swipeDistance < 0 && awardCurrentSlide > 0) {
        // Swipe right
        setAwardCurrentSlide((prev) => prev - 1);
      }
    }
  };

  // Mouse handlers for awards slider
  const handleAwardMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX);
    setScrollLeft(awardCurrentSlide * (1079 + 24)); // Use card width + gap
  };

  const handleAwardMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();

    const x = e.pageX;
    const walk = (startX - x) * 1.5; // Increased sensitivity
    const newPosition = scrollLeft + walk;

    // Update transform directly for smooth dragging
    if (awardSliderRef.current) {
      awardSliderRef.current.style.transform = `translateX(${-newPosition}px)`;
    }
  };

  const handleAwardMouseUp = () => {
    setIsDragging(false);

    if (!awardSliderRef.current) return;

    const slideWidth = 1079 + 24; // card width + gap
    const currentScroll = Math.abs(
      parseInt(
        awardSliderRef.current.style.transform
          .replace("translateX(", "")
          .replace("px)", "")
      )
    );
    const nearestSlide = Math.round(currentScroll / slideWidth);

    // Constrain to valid slide indices
    const newSlide = Math.max(0, Math.min(nearestSlide, 2));
    setAwardCurrentSlide(newSlide);

    // Reset transform to use state-based transform
    awardSliderRef.current.style.transform = "";
  };

  /**
   * Configuration for the awards slider using react-slick
   * Includes responsive settings and custom navigation
   */
  const awardSliderSettings = {
    dots: true, // Enable navigation dots
    infinite: false, // Disable infinite loop
    speed: 500, // Transition speed in milliseconds
    slidesToShow: 1, // Show one slide at a time
    slidesToScroll: 1, // Scroll one slide at a time
    arrows: false, // Hide default arrows
    dotsClass: styles.slickDots, // Custom class for dots container
    customPaging: () => <div className={styles.dot} />, // Custom dot element
    // Responsive breakpoints
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  return (
    <div className={styles.developerShowSection}>
      {/* Search and Filter Section */}
      <div className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="City, Building or community"
              className={styles.searchInput}
            />
          </div>
          <div className={styles.filterButtons}>
            <button className={styles.filterBtn}>
              Property type
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6L8 10L12 6"
                  stroke="#666666"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className={styles.filterBtn}>
              Price
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6L8 10L12 6"
                  stroke="#666666"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className={styles.filterBtn}>
              Bedrooms
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6L8 10L12 6"
                  stroke="#666666"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className={styles.filterBtn}>
              Listed as
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6L8 10L12 6"
                  stroke="#666666"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className={styles.moreFiltersBtn}>
              More Filters
              <Image src={filterVector} alt="Filter" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.developerInfo}>
            <h2>About Developer</h2>
            <p>
              Mohamed Alabbar founded and still chairs Emaar Properties, with
              Amit Jain as the CEO since 2016. The Dubai government owned Emaar
              Properties until it went public in 2000. Emaar has six business
              segments and 60 subsidiaries spread across 36 markets worldwide,
              such as Emaar Malls Group (shopping malls and retail), Emaar
              International (property development in international markets),
              Emaar Hospitality Group (a global provider of lifestyle
              experiences), Emaar Entertainment (provider of premium leisure and
              entertainment attractions), and Emaar Investment Holding.
            </p>
            <p>
              Downtown Dubai is one of the most popular freehold zones in Dubai
              amongst tenants and investors. Downtown Dubai not only has
              world-renowned attractions like the Burj Khalifa and the Dubai
              Fountain, but also a wide variety of freehold apartments. For
              example, Emaar properties for sale in Dubai, such as an apartment
              in Downtown Dubai may cost from AED 900,000, while one in Emaar IL
              Primo starts at AED 21 million.
            </p>
          </div>
          <div className={styles.developerLogo}>
            <Image
              src={EmaarLogo}
              alt="Emaar Logo"
              width={300}
              height={150}
              priority={true}
              quality={100}
            />
          </div>
        </div>
      </div>

      {/* Property Listings Section */}
      <div className={styles.listingsSection}>
        <div className={styles.listingsContainer}>
          <div className={styles.listingsHeader}>
            <div className={styles.listingInfo}>
              <h3>
                Off Plan properties for sale in Dubai developed by Emaar
                Properties
              </h3>
              <span className={styles.listingCount}>155 Listings</span>
            </div>
            <div className={styles.sortDropdown}>
              <span>Sort:</span>
              <button className={styles.sortButton}>
                Newest First
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="#666666"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className={styles.sliderWrapper}>
            <button
              className={`${styles.sliderArrow} ${styles.prevArrow}`}
              onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
              disabled={currentSlide === 0}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="#666666"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div
              className={styles.propertyGrid}
              style={{
                transform: `translateX(calc(-${currentSlide} * (400px + 24px)))`
              }}
            >
              {propertySlides.map((item) => (
                <div key={item} className={styles.propertyCard}>
                  <div className={styles.propertyImage}>
                    <span className={styles.propertyType}>Apartment</span>
                    <span className={styles.propertyYear}>2029</span>
                    <Image
                      src={DeveloperImage}
                      alt="Granada - Golf Course View"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className={styles.propertyInfo}>
                    <div>
                      <h4>Affordable Urban House</h4>
                      <p className={styles.location}>by Emaar Properties</p>
                      <div className={styles.priceContainer}>
                        <span className={styles.priceStart}>
                          Starting Price
                        </span>
                        <span className={styles.price}>USD 871K</span>
                      </div>
                    </div>
                    <div className={styles.propertyStats}>
                      <div className={styles.stat}>
                        <Image
                          src={BedroomIcon}
                          alt="Bedrooms"
                          width={20}
                          height={20}
                        />
                        <span>3 Br</span>
                      </div>
                      <div className={styles.stat}>
                        <Image
                          src={BathroomIcon}
                          alt="Bathrooms"
                          width={20}
                          height={20}
                        />
                        <span>3 Ba</span>
                      </div>
                      <div className={styles.stat}>
                        <Image
                          src={AreaVector}
                          alt="Area"
                          width={20}
                          height={20}
                        />
                        <span>2300 Sq.Ft</span>
                      </div>
                      <div className={styles.stat}>
                        <Image
                          src={WarehouseIcon}
                          alt="Area"
                          width={20}
                          height={20}
                        />
                        <span>1 Gr</span>
                      </div>
                    </div>
                    <div className={styles.propertyDetails}>
                      <p>
                        Dubai amongst tenants and investors. Downtown Dubai not
                        only has world-renowned attractions like the Burj
                        Khalifa and the Dubai Fountain, but also a wide variety
                        of freehold apartments. For example
                      </p>
                    </div>
                    <div className={styles.propertyActions}>
                      <button className={styles.actionButton}>
                        <HiOutlineMail size={20} color="#1A1A1A" />
                        <span>Email</span>
                      </button>
                      <button className={styles.actionButton}>
                        <Image src={callVector} alt="Call" />
                        <span>Call</span>
                      </button>
                      <button className={styles.actionButton}>
                        <BsWhatsapp size={20} color="#34C759" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              className={`${styles.sliderArrow} ${styles.nextArrow}`}
              onClick={() =>
                setCurrentSlide((prev) =>
                  prev + 1 >= propertySlides.length - 2 ? prev : prev + 1
                )
              }
              disabled={currentSlide >= propertySlides.length - 2}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 18L15 12L9 6"
                  stroke="#666666"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Update resale slider section */}
      <div className={styles.resaleSection}>
        <div className={styles.resaleHeader}>
          <div className={styles.resaleTitle}>
            <h3>Resale</h3>
            <span className={styles.listingCount}>155 Listings</span>
          </div>
        </div>

        <div
          className={styles.resaleSlider}
          ref={resaleSliderRef}
          onTouchStart={handleResaleTouchStart}
          onTouchMove={handleResaleTouchMove}
          onTouchEnd={handleResaleTouchEnd}
          onMouseDown={handleResaleMouseDown}
          onMouseMove={handleResaleMouseMove}
          onMouseUp={handleResaleMouseUp}
          onMouseLeave={handleResaleMouseUp}
        >
          <div
            className={styles.resaleCards}
            style={{
              transform: `translateX(${-resaleCurrentSlide * (1200 + 24)}px)`
            }}
          >
            {resaleSlides.map((item) => (
              <div key={item} className={styles.resaleCard}>
                <div className={styles.resaleImage}>
                  <Image
                    src={DeveloperImage}
                    alt="Granada - Golf Course View"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className={styles.resaleContent}>
                  <h4>Granada - Golf Course View - Large Plot</h4>
                  <p className={styles.resaleLocation}>
                    Live Tree Valley, Jumeirah Golf Estates
                  </p>
                  <p className={styles.resalePrice}>AED 16,950,00</p>
                  <div className={styles.resaleStats}>
                    <div className={styles.statGroup}>
                      <Image
                        src={BedroomIcon}
                        alt="Bedrooms"
                        width={16}
                        height={16}
                      />
                      <span>3 Br</span>
                    </div>
                    <div className={styles.statSeparator}>|</div>
                    <div className={styles.statGroup}>
                      <Image
                        src={BathroomIcon}
                        alt="Bathrooms"
                        width={16}
                        height={16}
                      />
                      <span>3 Ba</span>
                    </div>
                    <div className={styles.statSeparator}>|</div>
                    <div className={styles.statGroup}>
                      <Image
                        src={AreaVector}
                        alt="Area"
                        width={16}
                        height={16}
                      />
                      <span>2300 Sq.Ft</span>
                    </div>
                  </div>
                  <div className={styles.resaleDetails}>
                    <p>6,115 Sq. Ft. BUA</p>
                    <p>10,111 Sq. Ft. PLOT</p>
                    <p>Lime Tree Valley</p>
                    <p>Trakheesi Permit: 6123123124512</p>
                  </div>
                  <div className={styles.resaleFooter}>
                    <div className={styles.agentInfo}>
                      <Image
                        src={agentInfo}
                        alt="Agent"
                        width={40}
                        height={40}
                        className={styles.agentImage}
                      />
                      <span>Darren Murphy</span>
                    </div>
                    <div className={styles.footerActions}>
                      <button className={styles.footerButton}>
                        <BsWhatsapp size={20} color="#34C759" />
                        <span>WhatsApp</span>
                      </button>
                      <div className={styles.footerSeparator}>|</div>
                      <button className={styles.footerButton}>
                        <Image src={callVector} alt="Call" />
                        <span>Call Us</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Awards Section after resaleSection */}
      <div className={styles.awardsSection}>
        <div className={styles.awardsContainer}>
          <h3 className={styles.awardsTitle}>Awards Received from Emaar</h3>

          <Slider {...awardSliderSettings} className={styles.awardsSlider}>
            {/* First Award Card */}
            <div className={styles.awardCard}>
              <div className={styles.awardLeft}>
                <div className={styles.awardTeamImage}>
                  <Image
                    src={awardimg1}
                    alt="Team Photo"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </div>
              <div className={styles.awardRight}>
                <div className={styles.awardContent}>
                  <h4 className={styles.awardTitle}>Emaar Broker Awards</h4>
                  <p className={styles.awardSubtitle}>H1 2024</p>
                </div>
                <div className={styles.awardIconWrapper}>
                  <Image
                    src={awardsicon}
                    alt="Award Trophy"
                    width={156}
                    height={108}
                    className={styles.trophyImage}
                  />
                </div>
                <div className={styles.awardBottom}>
                  <span className={styles.awardYear}>2024</span>
                  <button className={styles.viewAwardBtn}>View Awards</button>
                </div>
              </div>
            </div>

            {/* Second Award Card */}
            <div className={styles.awardCard}>
              <div className={styles.awardLeft}>
                <div className={styles.awardTeamImage}>
                  <Image
                    src={awardimg1}
                    alt="Team Photo"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </div>
              <div className={styles.awardRight}>
                <div className={styles.awardContent}>
                  <h4 className={styles.awardTitle}>Broker award 2022</h4>
                  <p className={styles.awardSubtitle}>Q4 2022</p>
                </div>
                <div className={styles.awardIconWrapper}>
                  <Image
                    src={awardsicon}
                    alt="Award Trophy"
                    width={156}
                    height={108}
                    className={styles.trophyImage}
                  />
                </div>
                <div className={styles.awardBottom}>
                  <span className={styles.awardYear}>2022</span>
                  <button className={styles.viewAwardBtn}>View Awards</button>
                </div>
              </div>
            </div>

            {/* Third Award Card */}
            <div className={styles.awardCard}>
              <div className={styles.awardLeft}>
                <div className={styles.awardTeamImage}>
                  <Image
                    src={awardimg1}
                    alt="Team Photo"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </div>
              <div className={styles.awardRight}>
                <div className={styles.awardContent}>
                  <h4 className={styles.awardTitle}>15 Years Achievement</h4>
                  <p className={styles.awardSubtitle}>2023</p>
                </div>
                <div className={styles.awardIconWrapper}>
                  <Image
                    src={awardsicon}
                    alt="Award Trophy"
                    width={156}
                    height={108}
                    className={styles.trophyImage}
                  />
                </div>
                <div className={styles.awardBottom}>
                  <span className={styles.awardYear}>2023</span>
                  <button className={styles.viewAwardBtn}>View Awards</button>
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </div>
      <SubscribeSection />
    </div>
  );
};

export default DeveloperShow;
