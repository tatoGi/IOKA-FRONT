import React, { useState, useEffect, useRef } from "react";
import styles from "./Rental_Resale.show.module.css";
import Image from "next/image";
import SubscribeSection from "../SubscribeSection/SubscribeSection";
import defaultImage from "../../assets/img/default.webp"; // ✅ Correct import
import ContactForm from "../contactForm/ContactForm"; // Import the ContactForm component
import dynamic from "next/dynamic";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import galleryIcon from "../../assets/img/gallery-icon.svg";
import success from "../../assets/img/succsess.svg";
import { RENTAL_RESALE_RELATED_API } from "../../routes/apiRoutes";
import leftArrow from "../../assets/img/resale_left_arrow.svg"
import homeIcon from "../../assets/img/house-property-svgrepo-com.svg";
const RentalResaleShow = ({ RENTAL_RESALE_DATA }) => {
  console.log(RENTAL_RESALE_DATA);
  const galleryImages = JSON.parse(RENTAL_RESALE_DATA.gallery_images || "[]");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPropertySlide, setCurrentPropertySlide] = useState(0);
  const [relatedProperties, setRelatedProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const propertyGridRef = useRef(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(max-width: 768px)");
      setIsMobile(mediaQuery.matches);

      const handleResize = () => setIsMobile(mediaQuery.matches);
      mediaQuery.addEventListener("change", handleResize);

      return () => mediaQuery.removeEventListener("change", handleResize);
    }
  }, []);
  useEffect(() => {
    Fancybox.bind("[data-fancybox='gallery']", {
      Thumbs: {
        type: "classic",
        autoStart: true,
        showOnStart: true
      },
      Toolbar: {
        display: {
          left: ["infobar"],
          middle: ["zoomIn", "zoomOut", "toggle1to1", "rotateCCW", "rotateCW"],
          right: ["slideshow", "thumbs", "close"]
        }
      },
      Animation: {
        zoom: {
          opacity: "auto"
        }
      },
      Images: {
        Panzoom: {
          maxScale: 2
        }
      },
      on: {
        done: (fancybox, slide) => {
          // Adjust layout for mobile
          if (window.innerWidth <= 768) {
            const toolbar = document.querySelector(".fancybox__toolbar");
            if (toolbar) {
              toolbar.style.flexDirection = "column";
              toolbar.style.gap = "8px";
            }
          }
        }
      }
    });

    // Cleanup
    return () => {
      Fancybox.destroy();
    };
  }, [galleryImages]);

  const flattenedAddresses = RENTAL_RESALE_DATA.addresses
    .flat()
    .map((address) => {
      if (typeof address === "object" && address !== null) {
        return Object.values(address).join(", ");
      }
      return address;
    });
  const normalizedAmenities = RENTAL_RESALE_DATA.amenities.map((item) => {
    if (Array.isArray(item)) {
      return item[0]; // Extract the first element if it's an array
    } else if (typeof item === "object" && item !== null) {
      return Object.values(item)[0]; // Extract the first value if it's an object
    }
    return item; // Return the item as-is if it's already a string
  });
  const normalizedLanguages = RENTAL_RESALE_DATA.languages
    .map((item) => {
      if (Array.isArray(item)) {
        return item[0]; // Extract the first element if it's an array
      } else if (typeof item === "object" && item !== null) {
        return Object.values(item)[0]; // Extract the first value if it's an object
      }
      return item; // Return the item as-is if it's already a string
    })
    .filter(Boolean); // Remove any undefined or null values
  const languagesString = normalizedLanguages.join(", ");
  const Map = dynamic(
    () => import("./Map"), // Create a new Map.js component
    { ssr: false }
  );

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const scrollToNextProperty = () => {
    if (propertyGridRef.current) {
      const scrollAmount = propertyGridRef.current.offsetWidth;
      propertyGridRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const scrollToPrevProperty = () => {
    if (propertyGridRef.current) {
      const scrollAmount = propertyGridRef.current.offsetWidth;
      propertyGridRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    const fetchRelatedProperties = async () => {
      try {
        const response = await fetch(RENTAL_RESALE_RELATED_API);
        const data = await response.json();
        setRelatedProperties(data);
      } catch (error) {
        console.error('Error fetching related properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedProperties();
  }, []);

  const handleReadMore = (slug) => {
    window.location.href = `/rental-resale/${slug}`;
  };

  return (
    <>
      {isMobile && (
        <div className={styles.mobileGallery}>
          <div
            className={styles.sliderContainer}
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
              width: `${galleryImages.length * 100}%`
            }}
          >
            {galleryImages.map((image, index) => (
              <div key={index} className={styles.mobileImage}>
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}/storage/${image}`}
                  data-fancybox="gallery"
                  data-caption={`Gallery Image ${index + 1}`}
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${image}`}
                    alt={`Gallery Image ${index + 1}`}
                  />
                </a>
              </div>
            ))}
          </div>
          <div className={styles.sliderControls}>
            <button
              onClick={prevSlide}
              className={`${styles.sliderArrow} ${styles.prevArrow}`}
            >
              ‹
            </button>
            <button
              onClick={nextSlide}
              className={`${styles.sliderArrow} ${styles.nextArrow}`}
            >
              ›
            </button>
          </div>
          <div className={styles.photoCount}>
            <Image src={galleryIcon} alt="gallery" width={16} height={16} />+
            {galleryImages.length - 1}
          </div>
        </div>
      )}
      <div className= "container">
        {!isMobile && (
          <div className={styles.gallery}>
            {/* Main Image */}
            <div className={styles.mainImage}>
              <a
                href={
                  galleryImages[0]
                    ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${galleryImages[0]}`
                    : "/default.jpg"
                }
                data-fancybox="gallery"
                data-caption="Main Image"
              >
                <img
                  src={
                    galleryImages[0]
                      ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${galleryImages[0]}`
                      : "/default.jpg"
                  }
                  alt="Main"
                />
              </a>
              {Array.isArray(RENTAL_RESALE_DATA.tags) ? (
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', position: 'absolute', bottom: '10px', left: '10px' }}>
                          {RENTAL_RESALE_DATA.tags.includes("6") && (
                            <div className={styles.resaleButton} style={{ position: 'relative', zIndex: 1 }}>
                              <div className={styles.iconGroup}>
                                <Image
                                  src={homeIcon}
                                  alt="Home"
                                  width={18}
                                  height={18}
                                />
                              </div>
                              <span>Resale</span>
                            </div>
                          )}
                          {RENTAL_RESALE_DATA.tags.includes("5") && (
                            <div className={styles.resaleButton} style={{ position: 'relative', zIndex: 1 }}>
                              <div className={styles.iconGroup}>
                                <Image
                                  src={homeIcon}
                                  alt="Home"
                                  width={18}
                                  height={18}
                                />
                              </div>
                              <span>Rental</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className={styles.resaleButton}>
                          <div className={styles.iconGroup}>
                            <Image
                              src={homeIcon}
                              alt="Home"
                              width={18}
                              height={18}
                            />
                          </div>
                          <span>
                            {RENTAL_RESALE_DATA.tags === "6" ? "Resale" : "Rental"}
                          </span>
                        </div>
                      )}
            </div>

            {/* Small Images Grid */}
            <div className={styles.smallImagesGrid}>
              {galleryImages.slice(1, 4).map((image, index) => (
                <div key={index} className={styles.smallImage}>
                  <a
                    href={
                      image
                        ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${image}`
                        : "/default.jpg"
                    }
                    data-fancybox="gallery"
                    data-caption={`Gallery Image ${index + 2}`}
                  >
                    <img
                      src={
                        image
                          ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${image}`
                          : "/default.jpg"
                      }
                      alt={`Gallery ${index + 2}`}
                    />
                  </a>
                </div>
              ))}
              <div className={styles.smallImage}>
                {/* "+ More" Overlay - Opens Fancybox */}
                {galleryImages.length > 4 && (
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL}/storage/${galleryImages[4]}`}
                    data-fancybox="gallery"
                    data-caption={`Gallery Image 5`}
                    className={styles.moreOverlay}
                  >
                    +{galleryImages.length - 4} More
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Affordable Div */}
        {!isMobile && (
          <div className={styles.affordable}>
            <div className={styles.content}>
              {/* Title Section */}
              <div className={styles.leftsideaffordable}>
                <h2 className={styles.title}>
                  {RENTAL_RESALE_DATA.title || "Affordable Urban House"}
                </h2>

                {/* Features Section */}
                <div className={styles.features}>
                  <div className={styles.feature}>
                    <Image
                      src={require("/assets/img/bad.svg")}
                      alt="Bed Icon"
                      width={24}
                      height={24}
                    />
                    <span>{RENTAL_RESALE_DATA.bedroom} Br</span>
                  </div>
                  <div className={styles.feature}>
                    <Image
                      src={require("/assets/img/bath.svg")}
                      alt="Bath Icon"
                      width={24}
                      height={24}
                    />
                    <span>{RENTAL_RESALE_DATA.bathroom} Ba</span>
                  </div>
                  <div className={styles.feature}>
                    <Image
                      src={require("/assets/img/place.svg")}
                      alt="Area Icon"
                      width={24}
                      height={24}
                    />
                    <span>{RENTAL_RESALE_DATA.sq_ft} Sq.m</span>
                  </div>
                  <div className={styles.feature}>
                    <Image
                      src={require("/assets/img/garage.svg")}
                      alt="Car Icon"
                      width={24}
                      height={24}
                    />
                    <span>{RENTAL_RESALE_DATA.garage} Gr</span>
                  </div>
                </div>
              </div>
              {/* Prices Section */}
              <div className={styles.prices}>
                <div className={styles.price}>
                  <span className={styles.currency}>USD</span>
                  <span className={styles.amount}>
                    {RENTAL_RESALE_DATA.amount.amount}
                  </span>
                </div>
                <div className={styles.price}>
                  <span className={styles.currency}>UAD</span>
                  <span className={styles.amount}>
                    {RENTAL_RESALE_DATA.amount.amount_dirhams}
                  </span>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className={styles.addresses}>
              <p>{RENTAL_RESALE_DATA.subtitle}</p>
            </div>
          </div>
        )}
        {isMobile && (
          <div className={styles.affordable}>
            <div className={styles.content}>
              {/* Title Section */}
              <div className={styles.leftsideaffordable}>
                <div className={styles.prices}>
                  <div className={styles.price}>
                    <span className={styles.currency}>USD</span>
                    <span className={styles.amount}>
                      {RENTAL_RESALE_DATA.amount.amount}
                    </span>
                  </div>
                  <div className={styles.price}>
                    <span className={styles.currency}>UAD</span>
                    <span className={styles.amount}>
                      {RENTAL_RESALE_DATA.amount.amount_dirhams}
                    </span>
                  </div>
                </div>
                <h2 className={styles.title}>
                  {RENTAL_RESALE_DATA.title || "Affordable Urban House"}
                </h2>
                <h3 className={styles.subtitle}>
                  {RENTAL_RESALE_DATA.subtitle}
                </h3>
                {/* Features Section */}
                <span className={styles.line}></span>
                <div className={styles.features}>
                  <div className={styles.feature}>
                    <Image
                      src={require("/assets/img/bad.svg")}
                      alt="Bed Icon"
                      width={24}
                      height={24}
                    />
                    <span>{RENTAL_RESALE_DATA.bedroom} Br</span>
                  </div>
                  <div className={styles.feature}>
                    <Image
                      src={require("/assets/img/bath.svg")}
                      alt="Bath Icon"
                      width={24}
                      height={24}
                    />
                    <span>{RENTAL_RESALE_DATA.bathroom} Ba</span>
                  </div>
                  <div className={styles.feature}>
                    <Image
                      src={require("/assets/img/place.svg")}
                      alt="Area Icon"
                      width={24}
                      height={24}
                    />
                    <span>{RENTAL_RESALE_DATA.sq_ft} Sq.m</span>
                  </div>
                  <div className={styles.feature}>
                    <Image
                      src={require("/assets/img/garage.svg")}
                      alt="Car Icon"
                      width={24}
                      height={24}
                    />
                    <span>{RENTAL_RESALE_DATA.garage} Gr</span>
                  </div>
                </div>
              </div>
              {/* Prices Section */}
            </div>
          </div>
        )}
        <div className={styles.line}></div>
        {/* description Div */}
        {!isMobile && (
          <div className={styles.description}>
            <h1>Description</h1>
            <div className="row">
              <div className="col-md-8 pt-5 pe-5">
                <div className={styles.body}>
                  <pre className={styles.descriptionText}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: RENTAL_RESALE_DATA.description
                      }}
                    />
                  </pre>
                </div>

                <div className={styles.details}>
                  <h3>Details</h3>
                  <span className={styles.details_line}></span>
                  <div className={styles.detailsGrid}>
                    {RENTAL_RESALE_DATA.details.map((detail, index) => {
                      if (detail.title === "Price") {
                        return (
                          <div
                            className={`${styles.detailItem} ${styles.priceDetail}`}
                            key={index}
                          >
                            <span className={styles.detailLabel}>
                              {detail.title}
                            </span>
                            <span className={styles.detailValue}>
                              <span>
                                USD {RENTAL_RESALE_DATA.amount.amount}
                              </span>
                              <span>
                                AED {RENTAL_RESALE_DATA.amount.amount_dirhams}
                              </span>
                            </span>
                          </div>
                        );
                      }
                      return (
                        <div className={styles.detailItem} key={index}>
                          <span className={styles.detailLabel}>
                            {detail.title}
                          </span>
                          <span className={styles.detailValue}>
                            {detail.info}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                {/* Contact Information Section */}
                <div className={styles.sharediv}>
                  <div className={styles.content_sharediv}>
                    <div className={styles.imageContainer_share}>
                      <img
                        src={
                          RENTAL_RESALE_DATA.agent_photo
                            ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${RENTAL_RESALE_DATA.agent_photo}`
                            : "/default.jpg"
                        }
                        alt={RENTAL_RESALE_DATA.title}
                        className={styles.agentImage}
                      />
                    </div>
                    <div className={styles.textContainer}>
                      <h2 className={styles.name}>
                        {RENTAL_RESALE_DATA.agent_title}
                      </h2>
                      <span className={styles.role}>
                        {RENTAL_RESALE_DATA.agent_status}
                      </span>
                      <span className={styles.languages}>
                        Speaks: {languagesString}
                      </span>
                      <span className={styles.email}>example@gmail.com</span>
                    </div>
                  </div>

                  <div className={styles.contactButtons}>
                    <button
                      className={styles.contactBtnperson}
                      onClick={() => {
                        const formattedPhone = `+971${RENTAL_RESALE_DATA.agent_call.replace(
                          /\D/g,
                          ""
                        )}`;
                        window.location.href = `tel:${formattedPhone}`;
                      }}
                    >
                      Call
                    </button>
                    <button
                      className={styles.whatsappperson}
                      onClick={() => {
                        const formattedWhatsApp = `+971${RENTAL_RESALE_DATA.agent_whatsapp.replace(
                          /\D/g,
                          ""
                        )}`;
                        window.open(
                          `https://wa.me/${formattedWhatsApp}`,
                          "_blank"
                        );
                      }}
                    >
                      WhatsApp
                    </button>
                  </div>
                  <button className={styles.shareButton}>
                    <Image
                      src={require("../../assets/img/shareicon.png")}
                      alt="shareicon"
                    />{" "}
                    Share this Listing
                  </button>
                </div>

                {/* Location Map Section */}
                <div className={styles.sidevabarlocation}>
                  <Map location_link={RENTAL_RESALE_DATA.location_link} />
                </div>

                {/* Regulatory Information Section */}
                <div className={styles.sidebarqr}>
                  <h2 className={styles.sectionTitle}>
                    Regulatory Information
                  </h2>
                  <div className={styles.regulatoryInfo}>
                    {/* QR Code */}
                    <img
                      src={
                        RENTAL_RESALE_DATA.qr_photo
                          ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${RENTAL_RESALE_DATA.qr_photo}`
                          : "/default.jpg"
                      }
                      alt="QR Code"
                      className={styles.qrCode}
                    />

                    {/* Reference and DLD Permit Number */}
                    <div className={styles.infoText}>
                      <span className={styles.infoItem}>
                        <span className={styles.Referenceblue}>
                          Reference |{" "}
                        </span>
                        <span className={styles.Referenceblue_value}>
                          {RENTAL_RESALE_DATA.reference}
                        </span>
                      </span>
                      <span className={styles.infoItem}>
                        <span className={styles.DLD}>DLD Permit Number |</span>
                        <span className={styles.DLD_value}>
                          {RENTAL_RESALE_DATA.dld_permit_number}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.contactButton}>
                  <button className={styles.contactBtn} onClick={openModal}>
                    Contact Us
                  </button>
                  {/* Modal */}
                  {isModalOpen && (
                    <div className={styles.modalOverlay}>
                      <div className={styles.modalContent}>
                        <button
                          className={styles.closeButton}
                          onClick={closeModal}
                        >
                          &times; {/* Close icon (X) */}
                        </button>
                        <ContactForm pageTitle="Rental & Resale Page" />{" "}
                        {/* Render the ContactForm inside the modal */}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {isMobile && (
          <div className={styles.description}>
            <div className={styles.mobile_description_content}>
              <div className={styles.mobile_description_content_first}>
                <div className={styles.details}>
                  <h3>Key Information</h3>
                  <div className={styles.detailsGrid}>
                    {RENTAL_RESALE_DATA.details.map((detail, index) => {
                      if (detail.title === "Price") {
                        return (
                          <div
                            className={`${styles.detailItem} ${styles.priceDetail}`}
                            key={index}
                          >
                            <span className={styles.detailLabel}>
                              {detail.title}
                            </span>
                            <span className={styles.detailValue}>
                              <span>
                                USD {RENTAL_RESALE_DATA.amount.amount}
                              </span>
                              <span>
                                AED {RENTAL_RESALE_DATA.amount.amount_dirhams}
                              </span>
                            </span>
                          </div>
                        );
                      }
                      return (
                        <div className={styles.detailItem} key={index}>
                          <span className={styles.detailLabel}>
                            {detail.title}
                          </span>
                          <span className={styles.detailValue}>
                            {detail.info}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className={styles.body}>
                  <h1>Description</h1>
                  <pre className={styles.descriptionText}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: RENTAL_RESALE_DATA.description
                      }}
                    />
                  </pre>
                </div>
              </div>
              <div className={styles.mobile_description_content_second}>
                {/* Contact Information Section */}
                <div className={styles.sharediv}>
                  <div className={styles.content_sharediv}>
                    <div className={styles.imageContainer_share}>
                      <img
                        src={
                          RENTAL_RESALE_DATA.agent_photo
                            ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${RENTAL_RESALE_DATA.agent_photo}`
                            : "/default.jpg"
                        }
                        alt={RENTAL_RESALE_DATA.title}
                        className={styles.agentImage}
                      />
                    </div>
                    <div className={styles.textContainer}>
                      <h2 className={styles.name}>
                        {RENTAL_RESALE_DATA.agent_title}
                      </h2>
                      <span className={styles.role}>
                        {RENTAL_RESALE_DATA.agent_status}
                      </span>
                      <span className={styles.languages}>
                        Speaks: {languagesString}
                      </span>
                      <span className={styles.email}>example@gmail.com</span>
                    </div>
                  </div>

                  <div className={styles.contactButtons}>
                    <button
                      className={styles.contactBtnperson}
                      onClick={() => {
                        const formattedPhone = `+971${RENTAL_RESALE_DATA.agent_call.replace(
                          /\D/g,
                          ""
                        )}`;
                        window.location.href = `tel:${formattedPhone}`;
                      }}
                    >
                      Call
                    </button>
                    <button
                      className={styles.whatsappperson}
                      onClick={() => {
                        const formattedWhatsApp = `+971${RENTAL_RESALE_DATA.agent_whatsapp.replace(
                          /\D/g,
                          ""
                        )}`;
                        window.open(
                          `https://wa.me/${formattedWhatsApp}`,
                          "_blank"
                        );
                      }}
                    >
                      WhatsApp
                    </button>
                  </div>
                  <button className={styles.shareButton}>
                    <Image
                      src={require("../../assets/img/shareicon.png")}
                      alt="shareicon"
                    />{" "}
                    Share this Listing
                  </button>
                </div>
                <div className={styles.amenities_section}>
                  <h4>Amenities</h4>
                  <div className={styles.amenitiesGrid}>
                    {normalizedAmenities.map((amenity, index) => (
                      <div key={index} className={styles.amenityItem}>
                        <Image src={success} alt="success" />
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Location Map Section */}
                <div className={styles.sidevabarlocation}>
                  <Map location_link={RENTAL_RESALE_DATA.location_link} />
                </div>

                {/* Regulatory Information Section */}
                <div className={styles.sidebarqr}>
                  <h2 className={styles.sectionTitle}>
                    Regulatory Information
                  </h2>
                  <div className={styles.regulatoryInfo}>
                    {/* QR Code */}
                    <img
                      src={
                        RENTAL_RESALE_DATA.qr_photo
                          ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${RENTAL_RESALE_DATA.qr_photo}`
                          : "/default.jpg"
                      }
                      alt="QR Code"
                      className={styles.qrCode}
                    />

                    {/* Reference and DLD Permit Number */}
                    <div className={styles.infoText}>
                      <span className={styles.infoItem}>
                        <span className={styles.Referenceblue}>
                          Reference |{" "}
                        </span>
                        <span className={styles.Referenceblue_value}>
                          {RENTAL_RESALE_DATA.reference}
                        </span>
                      </span>
                      <span className={styles.infoItem}>
                        <span className={styles.DLD}>DLD Permit Number |</span>
                        <span className={styles.DLD_value}>
                          {RENTAL_RESALE_DATA.dld_permit_number}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.contactButton}>
                  <button className={styles.contactBtn} onClick={openModal}>
                    Contact Us
                  </button>
                  {/* Modal */}
                  {isModalOpen && (
                    <div className={styles.modalOverlay}>
                      <div className={styles.modalContent}>
                        <button
                          className={styles.closeButton}
                          onClick={closeModal}
                        >
                          &times; {/* Close icon (X) */}
                        </button>
                        <ContactForm pageTitle="Rental & Resale Page" />{" "}
                        {/* Render the ContactForm inside the modal */}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {!isMobile && (
          <div className={styles.amenities_section}>
            <h4>Amenities</h4>
            <div className={styles.amenitiesGrid}>
              {normalizedAmenities.map((amenity, index) => (
                <div key={index} className={styles.amenityItem}>
                  <Image src={success} alt="success" />
                  {amenity}
                </div>
              ))}
            </div>
          </div>
        )}
        {!isMobile && (
          <div className={styles.sameArea_poperies}>
            <h4>Properties available in the same area</h4>
            <div 
              className={styles.propertyGrid} 
              ref={propertyGridRef}
              onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
              onTouchMove={(e) => setTouchEnd(e.touches[0].clientX)}
              onTouchEnd={() => {
                if (!touchStart || !touchEnd) return;
                const distance = touchStart - touchEnd;
                const isLeftSwipe = distance > 50;
                const isRightSwipe = distance < -50;

                if (isLeftSwipe) {
                  scrollToNextProperty();
                } else if (isRightSwipe) {
                  scrollToPrevProperty();
                }
                setTouchStart(0);
                setTouchEnd(0);
              }}
            >
              {!isLoading && relatedProperties.map((property, index) => (
                <div
                  key={index}
                  className={styles.propertyCardLink}
                  onClick={() => handleReadMore(property.slug)}
                  style={{ cursor: "pointer" }}
                >
                  <div className={styles.propertyCard}>
                    <div className={styles.imageContainer}>
                      <Image
                        src={property.main_image ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${property.main_image}` : defaultImage}
                        alt={property.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={styles.propertyImage}
                        priority
                        unoptimized
                      />
                      {property.is_exclusive && (
                        <span className={styles.exclusive}>Exclusive</span>
                      )}
                    </div>

                    <div className={styles.propertyInfo}>
                      <h3 className={styles.propertytitle}>{property.title}</h3>
                      <p className={styles.location}>{property.location}</p>
                      <div className={styles.features}>
                        <div className={styles.feature}>
                          <Image
                            src={require("/assets/img/bad.svg")}
                            alt="Bed Icon"
                            width={24}
                            height={24}
                          />
                          <span>{property.bedroom} Br</span>
                        </div>
                        <div className={styles.feature}>
                          <Image
                            src={require("/assets/img/bath.svg")}
                            alt="Bath Icon"
                            width={24}
                            height={24}
                          />
                          <span>{property.bathroom} Ba</span>
                        </div>
                        <div className={styles.feature}>
                          <Image
                            src={require("/assets/img/place.svg")}
                            alt="Area Icon"
                            width={24}
                            height={24}
                          />
                          <span>{property.sq_ft} Sq.m</span>
                        </div>
                        <div className={styles.feature}>
                          <Image
                            src={require("/assets/img/garage.svg")}
                            alt="Car Icon"
                            width={24}
                            height={24}
                          />
                          <span>{property.garage} Gr</span>
                        </div>
                      </div>
                      <div className={styles.priceRow}>
                        <span className={styles.price}>USD {property.amount?.amount}</span>
                        <span className={styles.price}>AED {property.amount?.amount_dirhams}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {isMobile && (
          <div className={styles.sameArea_poperies}>
            <h4>Recommended for You</h4>
            <div 
              className={styles.propertyGrid} 
              ref={propertyGridRef}
              onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
              onTouchMove={(e) => setTouchEnd(e.touches[0].clientX)}
              onTouchEnd={() => {
                if (!touchStart || !touchEnd) return;
                const distance = touchStart - touchEnd;
                const isLeftSwipe = distance > 50;
                const isRightSwipe = distance < -50;

                if (isLeftSwipe) {
                  scrollToNextProperty();
                } else if (isRightSwipe) {
                  scrollToPrevProperty();
                }
                setTouchStart(0);
                setTouchEnd(0);
              }}
            >
              {!isLoading && relatedProperties.map((property, index) => (
                <div
                  key={index}
                  className={styles.propertyCardLink}
                  onClick={() => handleReadMore(property.slug)}
                  style={{ cursor: "pointer" }}
                >
                  <div className={styles.propertyCard}>
                    <div className={styles.imageContainer}>
                      <Image
                        src={property.main_image ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${property.main_image}` : defaultImage}
                        alt={property.title}
                        fill
                        sizes="(max-width: 768px) 100vw"
                        className={styles.propertyImage}
                        priority
                        unoptimized
                      />
                      {property.is_exclusive && (
                        <span className={styles.exclusive}>Exclusive</span>
                      )}
                    </div>

                    <div className={styles.propertyInfo}>
                      <h3>{property.title}</h3>
                      <p className={styles.location}>{property.location}</p>
                      <div className={styles.features}>
                        <div className={styles.feature}>
                          <Image
                            src={require("/assets/img/bad.svg")}
                            alt="Bed Icon"
                            width={20}
                            height={20}
                          />
                          <span>{property.bedroom} Br</span>
                        </div>
                        <div className={styles.feature}>
                          <Image
                            src={require("/assets/img/bath.svg")}
                            alt="Bath Icon"
                            width={20}
                            height={20}
                          />
                          <span>{property.bathroom} Ba</span>
                        </div>
                        <div className={styles.feature}>
                          <Image
                            src={require("/assets/img/place.svg")}
                            alt="Area Icon"
                            width={20}
                            height={20}
                          />
                          <span>{property.sq_ft} Sq.m</span>
                        </div>
                      </div>
                      <div className={styles.priceRow}>
                        <span className={styles.price}>USD {property.amount?.amount}</span>
                        <span className={styles.price}>AED {property.amount?.amount_dirhams}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <SubscribeSection />
      </div>
    </>
  );
};

export default RentalResaleShow;
