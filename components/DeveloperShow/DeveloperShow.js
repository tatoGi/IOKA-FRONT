import React, { useState, useRef, useEffect } from "react";
import styles from "./DeveloperShow.module.css";
import Image from "next/image";
import EmaarLogo from "../../assets/img/emmar.png";
import AreaVector from "../../assets/img/place.svg";
import BathroomIcon from "../../assets/img/bath.svg";
import BedroomIcon from "../../assets/img/bad.svg";
import WarehouseIcon from "../../assets/img/garage.svg";
import { HiOutlineMail } from "react-icons/hi";
import { BsWhatsapp } from "react-icons/bs";
import agentInfo from "../../assets/img/agentinfo.png";
import callVector from "../../assets/img/callvector.png";
import SubscribeSection from "../SubscribeSection/SubscribeSection";
import awardimg1 from "../../assets/img/awardimg1.png";
import Slider from "react-slick";
import SearchSection from "../SearchSection/SearchSection";
import baseimage from "../../assets/img/blogimage.png"; // Ensure this path is correct
import Link from "next/link";

const DeveloperShow = (developerData) => {
  const photos = developerData.developerData.photo
    ? JSON.parse(developerData.developerData.photo)
    : [];
  const decodeImageUrl = (url) => {
    return decodeURIComponent(url);
  };
  // Get the first photo (if available)
  // State for managing different sliders
  const [currentSlide, setCurrentSlide] = useState(0); // Controls off-plan properties slider

  // Get offplanListings from developerData
  const offplanListings = developerData.developerData.offplan_listings || [];
  const rentalListings =
    developerData.developerData.rental_resale_listings || [];
  const awards = developerData.developerData.awards || [];
  useEffect(() => {
    const slides = document.querySelectorAll('.slick-slide');
    slides.forEach((slide, index) => {
      if (index !== 0) {
        slide.setAttribute('inert', 'true');
      }
    });
  }, []);

  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    handleResize(); // Check on initial render
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /**
   * Configuration for the awards slider using react-slick
   * Includes responsive settings and custom navigation
   */
  const awardSliderSettings = {
    className: "slider variable-width",
    dots: true,
    infinite: true,
    centerMode: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    dotsClass: styles.slickDots, // Custom class for dots container
    customPaging: () => <div className={styles.dot} />, // Custom dot element
    beforeChange: (current, next) => {
      const slides = document.querySelectorAll('.slick-slide');
      slides.forEach((slide, index) => {
        if (index === next) {
          slide.removeAttribute('inert');
        } else {
          slide.setAttribute('inert', 'true');
        }
      });
    },
    responsive: [
      {
        breakpoint: 768, // For screens <= 768px
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false, // Disable center mode for smaller screens
          variableWidth: false, // Ensure full-width cards
        },
      },
      {
        breakpoint: 480, // For screens <= 480px
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
          variableWidth: false,
        },
      },
    ],
  };

  const resaleSliderSettings = {
    className: "slider variable-width",
    dots: true,
    infinite: true,
    centerMode: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    swipeToSlide: true,
    touchThreshold: 10,
    touchMove: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
          variableWidth: false
        }
      }
    ]
  };

  const limitTextLength = (text, maxLength) => {
    const strippedText = text.replace(/(<([^>]+)>)/gi, ""); // Remove HTML tags
    return strippedText.length > maxLength
      ? strippedText.substring(0, maxLength) + "..."
      : strippedText;
  };

  const formatPrice = (amount) => {
    if (!amount) return '0';
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toString();
  };

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 30;
    const isRightSwipe = distance < -30;

    if (isLeftSwipe && currentSlide < offplanListings.length - 2) {
      setCurrentSlide(prev => prev + 1);
    } else if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className={styles.developerShowSection}>
      {/* <div className="container">
        <SearchSection />
      </div> */}
      <div className="container">
        {/* Hero Section */}
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            {isMobileView ? (
              <>
                <div className={styles.developerLogo}>
                  {developerData.developerData.logo && (
                    <Image
                      src={
                        developerData.developerData.logo
                          ? `${
                              process.env.NEXT_PUBLIC_API_URL
                            }/storage/${decodeImageUrl(
                              developerData.developerData.logo
                            )}`
                          : EmaarLogo
                      }
                      alt="developer logo"
                      width={300}
                      height={150}
                      priority={true}
                      quality={100}
                    />
                  )}
                </div>
                <div className={styles.developerInfo}>
                  <h2>{developerData.developerData.title} </h2>
                  <div
                    className={styles.developerDescription}
                    dangerouslySetInnerHTML={{
                      __html: developerData.developerData.paragraph,
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <div className={styles.developerInfo}>
                  <h2>{developerData.developerData.title} </h2>
                  <div
                    className={styles.developerDescription}
                    dangerouslySetInnerHTML={{
                      __html: developerData.developerData.paragraph,
                    }}
                  />
                </div>
                <div className={styles.developerLogo}>
                  {developerData.developerData.logo && (
                    <Image
                      src={
                        developerData.developerData.logo
                          ? `${
                              process.env.NEXT_PUBLIC_API_URL
                            }/storage/${decodeImageUrl(
                              developerData.developerData.logo
                            )}`
                          : EmaarLogo
                      }
                      alt="developer logo"
                      width={300}
                      height={150}
                      priority={true}
                      quality={100}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Property Listings Section */}
        <div className={`container ${styles.listingsSection}`}>
          <div className={styles.listingsContainer}>
            <div className={styles.listingsHeader}>
            {!isMobileView && (
              <div className={styles.listingInfo}>
                <h3>
                  Off Plan Properties
                </h3>
                <span className={styles.listingCount}>
                  {offplanListings.length} Listings
                </span>
              </div>
              )}
               {isMobileView && (
                <div className={styles.listingInfo_mobile}>
                <h3>
                  Off Plan Properties
                </h3>
                <span className={styles.listingCount}>
                  {offplanListings.length} Listings
                </span>
              </div>
               )}
              {!isMobileView && (
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
              )}
            </div>

            {isMobileView ? (
              <div className={styles.listView}>
                {offplanListings.map((listing) => (
                  <Link href={`/offplan/${listing.slug}`} key={listing.id} className={styles.listItem}>
                    <div className={styles.propertyImage}>
                      <Image
                        src={
                          listing.main_photo
                            ? `${
                                process.env.NEXT_PUBLIC_API_URL
                              }/storage/${decodeImageUrl(listing.main_photo)}`
                            : baseimage
                        }
                        alt={listing.title}
                        layout="fill"
                        objectFit="cover"
                      />
                      <span className={styles.propertyType}>
                        {listing.property_type}
                      </span>
                      <span className={styles.propertyYear}>
                        {new Date(listing.created_at).getFullYear()}
                      </span>
                    </div>
                    <div className={styles.propertyInfo}>
                      <h4>{listing.title}</h4>
                      <p className={styles.location}>
                        by {developerData.developerData.title}
                      </p>
                      <div className={styles.priceContainer}>
                        <span className={styles.priceStart}>Starting Price</span>
                        <div className={styles.priceWrapper}>
                          <span className={styles.price}>USD {formatPrice(listing.amount)}</span>
                          <span className={styles.price}>AED {formatPrice(listing.amount)}</span>
                        </div>
                      </div>
                      <div className={styles.propertyStats}>
                        <div className={styles.stat}>
                          <Image
                            src={require("/assets/img/bad.svg")}
                            alt="Bedrooms"
                            width={20}
                            height={20}
                          />
                          <span>{listing.bedroom} Br</span>
                        </div>
                        <div className={styles.stat}>
                          <Image
                            src={require("/assets/img/bath.svg")}
                            alt="Bathrooms"
                            width={20}
                            height={20}
                          />
                          <span>{listing.bathroom} Ba</span>
                        </div>
                        <div className={styles.stat}>
                          <Image
                            src={require("/assets/img/place.svg")}
                            alt="Area"
                            width={20}
                            height={20}
                          />
                          <span>{listing.sq_ft} Sq.m</span>
                        </div>
                        <div className={styles.stat}>
                          <Image
                            src={require("/assets/img/garage.svg")}
                            alt="Garage"
                            width={20}
                            height={20}
                          />
                          <span>{listing.garage} Gr</span>
                        </div>
                      </div>
                      <div className={styles.propertyDetails}>
                        <p>{limitTextLength(listing.description, 150)}</p>
                      </div>
                      <div className={styles.propertyActions}>
                        <button className={`${styles.actionButton} ${styles.email}`}>
                          <HiOutlineMail size={20} color="#1A1A1A" />
                          <span>Email</span>
                        </button>
                        <button className={`${styles.actionButton} ${styles.phone}`}>
                          <Image src={callVector} alt="Call" />
                          <span>Call</span>
                        </button>
                        <button className={`${styles.actionButton} ${styles.whatsapp}`}>
                          <BsWhatsapp size={20} color="#34C759" />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
                <div className={styles.show_more_button}>Show more properties</div>
              </div>
            ) : (
              <div className={styles.sliderWrapper}>
                <button
                  className={`${styles.sliderArrow} ${styles.prevArrow}`}
                  onClick={() =>
                    setCurrentSlide((prev) => Math.max(prev - 1, 0))
                  }
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
                    transform: `translateX(calc(-${currentSlide} * (400px + 24px)))`,
                    touchAction: 'pan-x',
                    WebkitOverflowScrolling: 'touch',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    msUserSelect: 'none',
                    overflowX: 'hidden',
                    overflowY: 'hidden'
                  }}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {offplanListings.map((listing) => (
                    <Link href={`/offplan/${listing.slug}`} key={listing.id} className={styles.propertyCard}>
                      <div className={styles.propertyImage}>
                        <span className={styles.propertyType}>
                          {listing.property_type}
                        </span>
                        <span className={styles.propertyYear}>
                          {new Date(listing.created_at).getFullYear()}
                        </span>
                        <Image
                          src={
                            listing.main_photo
                              ? `${
                                  process.env.NEXT_PUBLIC_API_URL
                                }/storage/${decodeImageUrl(listing.main_photo)}`
                              : baseimage
                          }
                          alt={listing.title}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                      <div className={styles.propertyInfo}>
                        <div>
                          <h4>{listing.title}</h4>
                          <p className={styles.location}>
                            by {developerData.developerData.title}
                          </p>
                          <div className={styles.priceContainer}>
                            <span className={styles.priceStart}>
                              Starting Price
                            </span>
                            <div className={styles.priceWrapper}>
                              <span className={styles.price}>USD {formatPrice(listing.amount)}</span>
                              <span className={styles.price}>AED {formatPrice(listing.amount)}</span>
                            </div>
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
                            <span>{listing.bedroom} Br</span>
                          </div>
                          <div className={styles.stat}>
                            <Image
                              src={BathroomIcon}
                              alt="Bathrooms"
                              width={20}
                              height={20}
                            />
                            <span>{listing.bathroom} Ba</span>
                          </div>
                          <div className={styles.stat}>
                            <Image
                              src={AreaVector}
                              alt="Area"
                              width={20}
                              height={20}
                            />
                            <span>{listing.sq_ft} Sq.m</span>
                          </div>
                          <div className={styles.stat}>
                            <Image
                              src={WarehouseIcon}
                              alt="Area"
                              width={20}
                              height={20}
                            />
                            <span>{listing.garage} Gr</span>
                          </div>
                        </div>
                        <div className={styles.propertyDetails}>
                          <p>{limitTextLength(listing.description, 150)}</p>
                        </div>
                        <div className={styles.propertyActions}>
                          <button className={`${styles.actionButton} ${styles.email}`}>
                            <HiOutlineMail size={20} color="#1A1A1A" />
                            <span>Email</span>
                          </button>
                          <button className={`${styles.actionButton} ${styles.phone}`}>
                            <Image src={callVector} alt="Call" />
                            <span>Call</span>
                          </button>
                          <button className={`${styles.actionButton} ${styles.whatsapp}`}>
                            <BsWhatsapp size={20} color="#34C759" />
                            <span>WhatsApp</span>
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <button
                  className={`${styles.sliderArrow} ${styles.nextArrow}`}
                  onClick={() =>
                    setCurrentSlide((prev) =>
                      prev + 1 >= offplanListings.length - 2 ? prev : prev + 1
                    )
                  }
                  disabled={currentSlide >= offplanListings.length - 2}
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
            )}
          </div>
        </div>
      </div>

      {/* Resale Section */}
      <div className={styles.resaleSection}>
        <div className="container" style={{ overflow: 'hidden' }}>
          <div className={styles.resaleHeader}>
            <div className={styles.resaleTitle}>
              <h3>Rental Resale</h3>
              <span className={styles.listingCount}>
                {rentalListings.length} Listings
              </span>
            </div>
          </div>
        </div>

        {isMobileView ? (
          <div className={styles.listView}>
            {rentalListings.map((listing) => (
              <Link href={`/rental/${listing.slug}`} key={listing.id} className={styles.listItem}>
                <div className={styles.propertyImage}>
                  <Image
                    src={
                      listing.main_photo
                        ? `${
                            process.env.NEXT_PUBLIC_API_URL
                          }/storage/${decodeImageUrl(listing.main_photo)}`
                        : baseimage
                    }
                    alt={listing.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className={styles.propertyInfo}>
                  <h4>{listing.title}</h4>
                  <p className={styles.location}>{listing.location}</p>
                  <div className={styles.priceContainer}>
                    <span className={styles.price}>USD {formatPrice(listing.amount)}</span>
                    <span className={styles.price}>AED {formatPrice(listing.amount)}</span>
                  </div>
                  <div className={styles.propertyStats}>
                    <div className={styles.stat}>
                      <Image
                        src={BedroomIcon}
                        alt="Bedrooms"
                        width={20}
                        height={20}
                      />
                      <span>{listing.bedroom} Br</span>
                    </div>
                    <div className={styles.stat}>
                      <Image
                        src={BathroomIcon}
                        alt="Bathrooms"
                        width={20}
                        height={20}
                      />
                      <span>{listing.bathroom} Ba</span>
                    </div>
                    <div className={styles.stat}>
                      <Image
                        src={AreaVector}
                        alt="Area"
                        width={20}
                        height={20}
                      />
                      <span>{listing.sq_ft} Sq.m</span>
                    </div>
                    <div className={styles.stat}>
                      <Image
                        src={require("/assets/img/garage.svg")}
                        alt="Garage"
                        width={20}
                        height={20}
                      />
                      <span>{listing.garage} Gr</span>
                    </div>
                  </div>
                  <div className={styles.propertyDetails}>
                      <p>6,115 Sq. Ft. BUA</p>
                      <p>10,111 Sq. Ft. PLOT</p>
                      <p>Lime Tree Valley</p>
                      <p>Trakheesi Permit: 6123123124512</p>
                  </div>
                  <div className={styles.resaleFooter}>
                    <div className={styles.agentInfo}>
                      <Image
                        src={listing.agent_image || agentInfo}
                        alt="Agent"
                        width={40}
                        height={40}
                        className={styles.agentImage}
                      />
                      <span>{listing.agent_title || "Darren Murphy"}</span>
                    </div>
                    <div className={styles.footerActions}>
                      <button className={styles.footerButton}>
                        <BsWhatsapp size={20} color="#34C759" />
                        
                      </button>
                      <div className={styles.footerSeparator}>|</div>
                      <button className={styles.footerButton}>
                        <Image src={callVector} alt="Call" />
                       
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <Slider {...resaleSliderSettings} className={styles.resaleSlider}>
            {rentalListings.map((listing) => (
              <Link href={`/rental/${listing.slug}`} key={listing.id} className={styles.resaleCard}>
                <div className={styles.resaleImage}>
                  <Image
                    src={
                      listing.main_photo
                        ? `${
                            process.env.NEXT_PUBLIC_API_URL
                          }/storage/${decodeImageUrl(listing.main_photo)}`
                        : baseimage
                    }
                    alt={listing.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className={styles.resaleContent}>
                  <h4>{listing.title}</h4>
                  <p className={styles.resaleLocation}>{listing.location}</p>
                  <p className={styles.resalePrice}>AED {formatPrice(listing.amount)}</p>
                  <div className={styles.resaleStats}>
                    <div className={styles.statGroup}>
                      <Image
                        src={BedroomIcon}
                        alt="Bedrooms"
                        width={16}
                        height={16}
                      />
                      <span>{listing.bedroom} Br</span>
                    </div>
                    <div className={styles.statSeparator}>|</div>
                    <div className={styles.statGroup}>
                      <Image
                        src={BathroomIcon}
                        alt="Bathrooms"
                        width={16}
                        height={16}
                      />
                      <span>{listing.bathroom} Ba</span>
                    </div>
                    <div className={styles.statSeparator}>|</div>
                    <div className={styles.statGroup}>
                      <Image
                        src={AreaVector}
                        alt="Area"
                        width={16}
                        height={16}
                      />
                      <span>{listing.sq_ft} Sq.m</span>
                    </div>
                  </div>
                  
                  <div className={styles.resaleDetails}>
                   
                    {listing.details && listing.details.map((detail, index) => (
                      <p key={index}>{detail.title}: {detail.info}</p>
                    ))}
                  </div>
                  <div className={styles.resaleFooter}>
                    <div className={styles.agentInfo}>
                      <Image
                        src={listing.agent_image || agentInfo} // Use agent image or fallback
                        alt="Agent"
                        width={40}
                        height={40}
                        className={styles.agentImage}
                      />
                      <span>{listing.agent_title || "Darren Murphy"}</span>
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
              </Link>
            ))}
          </Slider>
        )}
      </div>

      {/* Add Awards Section after resaleSection */}
      <div className={styles.awardsSection}>
        <div className={styles.awardsContainer}>
          <div className="container">
          <h3 className={styles.awardsTitle}>Awards Received from Emaar</h3>
          </div>
        

          <Slider {...awardSliderSettings} className={styles.awardsSlider}>
            {awards.map((award, index) => (
              <div key={index} className={styles.awardCard}>
                <div className={styles.awardLeft}>
                  <div className={styles.awardTeamImage}>
                    <Image
                      src={awardimg1} // Use a fallback or dynamic image if available
                      alt="Team Photo"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </div>

                <div className={styles.awardRight}>
                  <div className={styles.awardContent}>
                    <h4 className={styles.awardTitle}>{award.award_title}</h4>
                    <div
                      className={styles.awardSubtitle}
                      dangerouslySetInnerHTML={{
                        __html: award.award_description 
                          ? (award.award_description.length > 150 
                              ? award.award_description.substring(0, 150) + '...' 
                              : award.award_description)
                          : "No description available"
                      }}
                    />
                  </div>
                  {isMobileView ? (
                    <div className={styles.mobileAwardLayout}>
                      <span className={styles.awardYear}>{award.award_year}</span>
                      <div className={styles.awardIconWrapper}>
                        <Image
                          src={
                            award.award_photo
                              ? `${
                                  process.env.NEXT_PUBLIC_API_URL
                                }/storage/${decodeImageUrl(award.award_photo)}`
                              : EmaarLogo
                          }
                          alt="Award Trophy"
                          width={156}
                          height={108}
                          className={styles.trophyImage}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className={styles.awardIconWrapper}>
                      <Image
                        src={
                          award.award_photo
                            ? `${
                                process.env.NEXT_PUBLIC_API_URL
                              }/storage/${decodeImageUrl(award.award_photo)}`
                            : EmaarLogo
                        }
                        alt="Award Trophy"
                        width={156}
                        height={108}
                        className={styles.trophyImage}
                      />
                    </div>
                  )}
                  <div className={styles.awardBottom}>
                    {!isMobileView && <span className={styles.awardYear}>{award.award_year}</span>}
                    <button className={styles.viewAwardBtn}>View Awards</button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>

        </div>
      </div>
      <div className="container">
        <SubscribeSection />
      </div>
    </div>
  );
};

export default DeveloperShow;
