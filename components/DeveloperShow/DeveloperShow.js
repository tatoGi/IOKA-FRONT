import React, { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
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
import awardimg1 from "../../assets/img/awardimg1.png";
import SearchSection from "../SearchSection/SearchSection";
import baseimage from "../../assets/img/blogimage.png"; // Ensure this path is correct
import Link from "next/link";
import Meta from "../Meta/Meta";

const DeveloperShow = (developerData) => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  const photos = developerData.developerData.photo
    ? typeof developerData.developerData.photo === 'string'
      ? JSON.parse(developerData.developerData.photo)
      : developerData.developerData.photo
    : [];
  const decodeImageUrl = (url) => {
    return decodeURIComponent(url);
  };
  // Get the first photo (if available)
  // State for managing different sliders
  const [currentSlide, setCurrentSlide] = useState(0); // Controls off-plan properties slider
  const propertyCardRef = useRef(null);
  const [slideOffset, setSlideOffset] = useState(0);

  // Get offplanListings from developerData
  const offplanListings = developerData.developerData.offplan_listings || [];

  useEffect(() => {
    const calculateOffset = () => {
      if (propertyCardRef.current) {
        const cardWidth = propertyCardRef.current.offsetWidth;
        const gap = 20; // from .propertyGrid style
        setSlideOffset(cardWidth + gap);
      }
    };

    calculateOffset();
    window.addEventListener('resize', calculateOffset);

    return () => {
      window.removeEventListener('resize', calculateOffset);
    };
  }, [offplanListings]);
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
    dots: awards.length > 1,
    infinite: awards.length > 1,
    centerMode: awards.length > 1,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: awards.length > 1,
    dotsClass: styles.slickDots,
    customPaging: () => <div className={styles.dot} />,
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
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
          variableWidth: false,
          dots: awards.length > 1,
          arrows: false
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
          variableWidth: false,
          dots: awards.length > 1,
          arrows: false
        }
      }
    ]
  };

  const resaleSliderSettings = {
    className: "slider variable-width",
    dots: rentalListings.length > 1,
    infinite: rentalListings.length > 1,
    centerMode: rentalListings.length > 1,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: rentalListings.length > 1,
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
          variableWidth: false,
          dots: rentalListings.length > 1,
          arrows: false
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

  const sliderRef = useRef(null);

  const offplanSliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: offplanListings.length === 1 ? 1 : 3,
    slidesToScroll: 1,
    arrows: false, // We'll use custom arrows
    centerMode: false, // Ensure items are left-aligned, especially when there's only one
    variableWidth: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: offplanListings.length === 1 ? 1 : 2 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  const [visibleMobileOffplan, setVisibleMobileOffplan] = useState(4);

  // Prepare meta data for the Meta component
  const metaData = {
    developer: {
      ...developerData.developerData,
      metadata: {
        ...developerData.developerData.metadata,
        // Ensure we have fallback values
        meta_title: developerData.developerData.metadata?.meta_title || developerData.developerData.title,
        meta_description: developerData.developerData.metadata?.meta_description || developerData.developerData.description || '',
        og_image: developerData.developerData.metadata?.og_image || developerData.developerData.logo || ''
      }
    }
  };

  return (
    <>
      <Meta data={metaData} type="developer" />
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
        <div className={styles.listingsSection}>
          <div className={styles.listingsContainer}>
            <div className={styles.listingsHeader}>
            {!isMobileView && (
              <div className={styles.listingInfo}>
                <h3>
                  OffPlan Properties
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
             
            </div>

            {isMobileView ? (
              <div className={styles.listView}>
                {offplanListings.slice(0, visibleMobileOffplan).map((listing) => (
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
                       
                        <button className={`${styles.actionButton} ${styles.whatsapp}`}>
                          <BsWhatsapp size={20} color="#34C759" />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
                {visibleMobileOffplan < offplanListings.length && (
                  <div
                    className={styles.show_more_button}
                    onClick={() => setVisibleMobileOffplan(visibleMobileOffplan + 4)}
                    style={{ cursor: "pointer" }}
                  >
                    Show more properties
                  </div>
                )}
              </div>
              
            ) : (
              <div className={styles.sliderContainer}>
                <button
                  className={`${styles.sliderArrow} ${styles.prevArrow}`}
                  onClick={() => sliderRef.current && sliderRef.current.slickPrev()}
                  disabled={currentSlide === 0}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="28" viewBox="0 0 16 28" fill="none">
                    <path d="M0.585821 12.588C-0.195277 13.369 -0.195277 14.6373 0.585821 15.4183L12.5835 27.4143C13.3646 28.1952 14.6331 28.1952 15.4142 27.4143C16.1953 26.6333 16.1953 25.3649 15.4142 24.584L4.82874 14L15.4079 3.41604C16.189 2.63506 16.189 1.36673 15.4079 0.585741C14.6268 -0.195247 13.3583 -0.195247 12.5772 0.585741L0.579572 12.5817L0.585821 12.588Z" fill="#0A273B"/>
                  </svg>
                </button>
                <div className={styles.sliderWrapper}>
                  <Slider
                    {...offplanSliderSettings}
                    ref={sliderRef}
                    beforeChange={(_, next) => setCurrentSlide(next)}
                  >
                    {offplanListings.map((listing, index) => (
                      <Link
                        href={`/offplan/${listing.slug}`}
                        key={listing.id}
                        className={styles.propertyCard}
                      >
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
                          
                            <button className={`${styles.actionButton} ${styles.whatsapp}`}>
                              <BsWhatsapp size={20} color="#34C759" />
                              <span>WhatsApp</span>
                            </button>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </Slider>
                </div>
                <div className={styles.sliderArrowContainer}>
                  <button
                    className={`${styles.sliderArrow} ${styles.nextArrow}`}
                    onClick={() => sliderRef.current && sliderRef.current.slickNext()}
                    disabled={currentSlide >= offplanListings.length - 3}
                  >
                    <svg width="16" height="28" viewBox="0 0 16 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.4142 15.412C16.1953 14.631 16.1953 13.3627 15.4142 12.5817L3.41652 0.585741C2.63542 -0.195248 1.36692 -0.195248 0.585823 0.585741C-0.195274 1.36673 -0.195274 2.63506 0.585823 3.41604L11.1713 14L0.592071 24.584C-0.189026 25.3649 -0.189026 26.6333 0.592071 27.4143C1.37317 28.1952 2.64167 28.1952 3.42277 27.4143L15.4204 15.4183L15.4142 15.412Z" fill="#0A273B"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resale Section */}
        <div className={styles.resaleSection}>
          <div className={`${isMobileView ? 'resalecontainer' : 'container'}`} style={{ overflow: 'hidden' }}>
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
                    <p className={styles.location}>{listing.subtitle}</p>
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
          ) : rentalListings.length === 1 ? (
            <div className={styles.singleRentalContainer}>
              <Link href={`/rental/${rentalListings[0].slug}`} className={styles.resaleCard}>
                <div className={styles.resaleImage}>
                  <Image
                    src={
                      rentalListings[0].main_photo
                        ? `${
                            process.env.NEXT_PUBLIC_API_URL
                          }/storage/${decodeImageUrl(rentalListings[0].main_photo)}`
                        : baseimage
                    }
                    alt={rentalListings[0].title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className={styles.resaleContent}>
                  <h4>{rentalListings[0].title}</h4>
                  <p className={styles.resaleLocation}>
                   
                        {rentalListings[0].locations && rentalListings[0].locations.length > 0 
                          ? rentalListings[0].locations[0].title 
                          : rentalListings[0].subtitle || rentalListings[0].location || ''}
                      </p>
                  <p className={styles.resalePrice}>AED {formatPrice(rentalListings[0].amount)}</p>
                  <div className={styles.resaleStats}>
                    <div className={styles.statGroup}>
                      <Image
                        src={BedroomIcon}
                        alt="Bedrooms"
                        width={16}
                        height={16}
                      />
                      <span>{rentalListings[0].bedroom} Br</span>
                    </div>
                    <div className={styles.statSeparator}>|</div>
                    <div className={styles.statGroup}>
                      <Image
                        src={BathroomIcon}
                        alt="Bathrooms"
                        width={16}
                        height={16}
                      />
                      <span>{rentalListings[0].bathroom} Ba</span>
                    </div>
                    <div className={styles.statSeparator}>|</div>
                    <div className={styles.statGroup}>
                      <Image
                        src={AreaVector}
                        alt="Area"
                        width={16}
                        height={16}
                      />
                      <span>{rentalListings[0].sq_ft} Sq.m</span>
                    </div>
                    <div className={styles.statSeparator}>|</div>
                    <div className={styles.statGroup}>
                      <Image
                        src={require("/assets/img/garage.svg")}
                        alt="Garage"
                        width={16}
                        height={16}
                      />
                      <span>{rentalListings[0].garage} Gr</span>
                    </div>
                  </div>
                  <div className={styles.resaleDetails}>
                    {rentalListings[0].details && rentalListings[0].details.map((detail, index) => (
                      <p key={index}>{detail.title}: {detail.info}</p>
                    ))}
                  </div>
                  <div className={styles.resaleFooter}>
                    <div className={styles.agentInfo}>
                      <Image
                        src={rentalListings[0].agent_image || agentInfo}
                        alt="Agent"
                        width={40}
                        height={40}
                        className={styles.agentImage}
                      />
                      <span>{rentalListings[0].agent_title || "Darren Murphy"}</span>
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
                      <div className={styles.statSeparator}>|</div>
                      <div className={styles.statGroup}>
                        <Image
                          src={require("/assets/img/garage.svg")}
                          alt="Garage"
                          width={16}
                          height={16}
                        />
                        <span>{listing.garage} Gr</span>
                      </div>
                    </div>
                    
                    <div className={styles.resaleDetails}>
                     
                      {(() => {
                        const details = listing.details;
                        let parsedDetails = [];

                        if (details) {
                          if (typeof details === 'string') {
                            try {
                              parsedDetails = JSON.parse(details);
                            } catch (e) {
                              console.error("Failed to parse details:", e);
                            }
                          } else {
                            parsedDetails = details;
                          }
                        }

                        if (Array.isArray(parsedDetails)) {
                          return parsedDetails.map((detail, index) => (
                            <p key={index}>{detail.title}: {detail.info}</p>
                          ));
                        }

                        return null;
                      })()}
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

            {isMobileView ? (
              <Slider
                {...awardSliderSettings}
                className={styles.awardsSlider}
              >
                {awards.map((award, index) => (
                  <div key={index} className={styles.awardCard}>
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
                      <div className="d-flex align-items-center justify-content-between">
                      <div className={styles.awardYear}>
                          <span>{award.award_year}</span>
                        </div>
                      <div className={styles.awardIconWrapper}>
                        
                        <Image
                          src={
                            award.award_photo
                              ? `${
                                  process.env.NEXT_PUBLIC_API_URL
                                }/storage/${decodeImageUrl(award.award_photo)}`
                              : EmaarLogo
                          }
                          alt={award.logo_alt || "Award Trophy"}
                          width={156}
                          height={108}
                          className={styles.trophyImage}
                        />
                       
                      </div>
                      </div>
                   
                      <div className={styles.awardBottom}>
                       
                        <button className={styles.viewAwardBtn}>View Awards</button>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            ) : awards.length === 1 ? (
              <div className={styles.singleAwardContainer}>
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
                      <h4 className={styles.awardTitle}>{awards[0].award_title}</h4>
                      <div
                        className={styles.awardSubtitle}
                        dangerouslySetInnerHTML={{
                          __html: awards[0].award_description 
                            ? (awards[0].award_description.length > 150 
                                ? awards[0].award_description.substring(0, 150) + '...' 
                                : awards[0].award_description)
                            : "No description available"
                        }}
                      />
                    </div>
                    <div className={styles.awardIconWrapper}>
                      <Image
                        src={
                          awards[0].award_photo
                            ? `${
                                process.env.NEXT_PUBLIC_API_URL
                              }/storage/${decodeImageUrl(awards[0].award_photo)}`
                            : EmaarLogo
                        }
                        alt="Award Trophy"
                        width={156}
                        height={108}
                        className={styles.trophyImage}
                      />
                    </div>
                    <div className={styles.awardBottom}>
                      <span className={styles.awardYear}>{awards[0].award_year}</span>
                      <button className={styles.viewAwardBtn}>View Awards</button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Slider {...awardSliderSettings} className={styles.awardsSlider}>
                {awards.map((award, index) => (
                  <div key={index} className={styles.awardCard}>
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
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default DeveloperShow;
