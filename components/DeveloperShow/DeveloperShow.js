import React, { useState, useRef, useEffect } from "react";
import styles from "./DeveloperShow.module.css";
import Image from "next/image";
import EmaarLogo from "../../assets/img/emmar.png";
import AreaVector from "../../assets/img/areavector.png";
import BathroomIcon from "../../assets/img/bathroom.png";
import BedroomIcon from "../../assets/img/Vector2.png";
import WarehouseIcon from "../../assets/img/warehousevector.png";
import { HiOutlineMail } from "react-icons/hi";
import { BsWhatsapp } from "react-icons/bs";
import agentInfo from "../../assets/img/agentinfo.png";
import callVector from "../../assets/img/callvector.png";
import SubscribeSection from "../SubscribeSection/SubscribeSection";
import awardimg1 from "../../assets/img/awardimg1.png";
import Slider from "react-slick";
import SearchSection from "../SearchSection/SearchSection";
import baseimage from "../../assets/img/blogimage.png"; // Ensure this path is correct

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
    }
  };

  const resaleSliderSettings = {
    className: "slider variable-width",
    dots: true,
    infinite: true,
    centerMode: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true
  };

  const limitTextLength = (text, maxLength) => {
    const strippedText = text.replace(/(<([^>]+)>)/gi, ""); // Remove HTML tags
    return strippedText.length > maxLength
      ? strippedText.substring(0, maxLength) + "..."
      : strippedText;
  };
  return (
    <div className={styles.developerShowSection}>
      <div className="container">
        <SearchSection />
      </div>
      <div className="container">
        {/* Hero Section */}
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <div className={styles.developerInfo}>
              <h2>{developerData.developerData.title} </h2>
              <div className={styles.developerDescription}
                dangerouslySetInnerHTML={{
                  __html: developerData.developerData.paragraph
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
                <span className={styles.listingCount}>
                  {offplanListings.length} Listings
                </span>
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
                {offplanListings.map((listing) => (
                  <div key={listing.id} className={styles.propertyCard}>
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
                          <span className={styles.price}>
                            USD {listing.amount}
                          </span>
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
                          <span>{listing.sq_ft} Sq.Ft</span>
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
          </div>
        </div>

      </div>

        {/* Update resale slider section */}
        <div className={styles.resaleSection}>
          <div className="container">
          <div className={styles.resaleHeader}>
            <div className={styles.resaleTitle}>
              <h3>Resale</h3>
              <span className={styles.listingCount}>
                {rentalListings.length} Listings
              </span>
            </div>
          </div>
          </div>
         

          <Slider {...resaleSliderSettings} className={styles.resaleSlider}>
            {rentalListings.map((listing) => (
              <div key={listing.id} className={styles.resaleCard}>
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
                  <p className={styles.resalePrice}>AED {listing.amount}</p>
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
                      <span>{listing.sq_ft} Sq.Ft</span>
                    </div>
                  </div>
                  <div className={styles.resaleDetails}>
                    <p>{limitTextLength(listing.description, 150)}</p>
                    <p>6,115 Sq. Ft. BUA</p>
                    <p>10,111 Sq. Ft. PLOT</p>
                    <p>Lime Tree Valley</p>
                    <p>Trakheesi Permit: 6123123124512</p>
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
              </div>
            ))}
          </Slider>
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
                        __html:
                          award.award_description || "No description available"
                      }}
                    />
                  </div>
                  <div className={styles.awardIconWrapper}>
                    <Image
                      src={
                        award.award_photo
                          ? `${
                              process.env.NEXT_PUBLIC_API_URL
                            }/storage/${decodeImageUrl(award.award_photo)}`
                          : EmaarLogo // Fallback image
                      }
                      alt="Award Trophy"
                      width={156}
                      height={108}
                      className={styles.trophyImage}
                    />
                  </div>
                  <div className={styles.awardBottom}>
                    <span className={styles.awardYear}>{award.award_year}</span>
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
