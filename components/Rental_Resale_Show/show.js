import React, { useState, useEffect, useRef } from "react";
import styles from "./Rental_Resale.show.module.css";
import Image from "next/image";
import defaultImage from "../../assets/img/default.webp"; // ✅ Correct import
import ContactForm from "../contactForm/ContactForm"; // Import the ContactForm component
import dynamic from "next/dynamic";
import galleryIcon from "../../assets/img/gallery-icon.svg";
import success from "../../assets/img/succsess.svg";
import { RENTAL_RESALE_RELATED_API } from "../../routes/apiRoutes";
import homeIcon from "../../assets/img/house-property-svgrepo-com.svg";
import PhotoSwipe from 'photoswipe';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

const RentalResaleShow = ({ RENTAL_RESALE_DATA }) => {
  // Initialize state
  const [isClient, setIsClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [relatedProperties, setRelatedProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const propertyGridRef = useRef(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle mobile detection
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(max-width: 768px)");
      setIsMobile(mediaQuery.matches);

      const handleResize = () => setIsMobile(mediaQuery.matches);
      mediaQuery.addEventListener("change", handleResize);

      return () => mediaQuery.removeEventListener("change", handleResize);
    }
  }, []);

  // Parse gallery images
  const galleryImages = React.useMemo(() => {
    if (!RENTAL_RESALE_DATA?.gallery_images) {
      return [];
    }
  
    try {
      let images = [];
      
      // If it's already an array
      if (Array.isArray(RENTAL_RESALE_DATA.gallery_images)) {
        images = RENTAL_RESALE_DATA.gallery_images;
      }
      // If it's a string, try to parse as JSON
      else if (typeof RENTAL_RESALE_DATA.gallery_images === 'string') {
        try {
          // First try to parse as JSON
          const parsed = JSON.parse(RENTAL_RESALE_DATA.gallery_images);
          images = Array.isArray(parsed) ? parsed : [parsed];
        } catch (e) {
          // If JSON parsing fails, treat it as a single image path
          images = [RENTAL_RESALE_DATA.gallery_images];
        }
      }
  
      // Filter and clean image paths
      const validImages = images
        .filter(img => img && typeof img === 'string' && img.trim() !== '')
        .map(img => {
          // Remove any quotes and backslashes
          const cleanPath = img.replace(/^["']|["']$/g, '').replace(/\\/g, '');
          // Remove any leading/trailing slashes
          return cleanPath.replace(/^\/+|\/+$/g, '');
        });
  
      return validImages;
    } catch (error) {
      return [];
    }
  }, [RENTAL_RESALE_DATA?.gallery_images]);

  // Get image URL helper
  const getImageUrl = (image) => {
    if (!image) {
      return defaultImage;
    }
  
    try {
      // Clean the image path
      const cleanPath = image.replace(/^["']|["']$/g, '').replace(/\\/g, '').replace(/^\/+|\/+$/g, '');
      
      // If it's already a full URL, return it
      if (cleanPath.startsWith('http')) {
        return decodeImageUrl(cleanPath);
      }
      
      // Construct the full URL
      const url = `${process.env.NEXT_PUBLIC_API_URL}/storage/${cleanPath}`;
      return decodeImageUrl(url);
    } catch (error) {
      return defaultImage;
    }
  };

  // Decode image URL helper
  const decodeImageUrl = (url) => {
    try {
      return decodeURIComponent(url);
    } catch (error) {
      return url; // Return original URL if decoding fails
    }
  };

  // Initialize PhotoSwipe
  useEffect(() => {
    if (typeof window === 'undefined' || !galleryImages?.length) return;

    const initializePhotoSwipe = () => {
      try {
        // Create properly structured gallery items
        const items = galleryImages
          .filter(image => image && typeof image === 'string')
          .map((image, index) => {
            const src = getImageUrl(image);
            return {
              src,
              w: 1920, // Default width
              h: 1080, // Default height
              alt: `${RENTAL_RESALE_DATA?.title || ''} - Image ${index + 1}`
            };
          });

        if (items.length === 0) {
          return;
        }

        // Initialize PhotoSwipe Lightbox
        const lightbox = new PhotoSwipeLightbox({
          gallery: '.gallery',
          children: 'a',
          pswpModule: PhotoSwipe,
          showHideAnimationType: 'fade',
          showAnimationDuration: 300,
          hideAnimationDuration: 300,
          zoomAnimationDuration: 300,
          easing: 'cubic-bezier(0.4, 0, 0.22, 1)',
          paddingFn: () => {
            return {
              top: 30,
              bottom: 30,
              left: 0,
              right: 0
            };
          }
        });

        // Add PhotoSwipe UI
        const pswp = new PhotoSwipe({
          dataSource: items,
          ...lightbox.options
        });

        // Bind click events
        lightbox.on('uiRegister', () => {
          lightbox.pswp.ui.registerElement({
            name: 'custom-caption',
            order: 9,
            isButton: false,
            appendTo: 'root',
            html: 'Caption text',
            onInit: (el, pswp) => {
              lightbox.pswp.on('change', () => {
                const currSlideIndex = lightbox.pswp.currIndex;
                el.innerHTML = `${currSlideIndex + 1} / ${items.length}`;
              });
            }
          });
        });

        lightbox.init();

        return () => {
          lightbox.destroy();
        };
      } catch (error) {
        // Silent error handling
      }
    };

    // Wait for component to be fully mounted and images to be loaded
    const timer = setTimeout(initializePhotoSwipe, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [galleryImages]);

  // Render gallery image
  const renderGalleryImage = (image, index, isMain = false) => {
    if (!image) return null;
    
    try {
      const imageUrl = getImageUrl(image);
      if (!imageUrl) return null;
      
      return (
        <a
          href={imageUrl}
          className="gallery-item"
          key={`gallery-${image}-${index}`}
          data-pswp-width="1920"
          data-pswp-height="1080"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src={imageUrl}
            alt={`${RENTAL_RESALE_DATA?.title || ''} - Image ${index + 1}`}
            loading={isMain || index === 0 ? "eager" : "lazy"}
            className={styles.galleryImage}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </a>
      );
    } catch (error) {
      return null;
    }
  };

  const locationData = React.useMemo(() => {
    if (!RENTAL_RESALE_DATA.location_link) {
      return null;
    }

    try {
      // If it's already an object, return it as is
      if (typeof RENTAL_RESALE_DATA.location_link === 'object' && RENTAL_RESALE_DATA.location_link !== null) {
        return RENTAL_RESALE_DATA.location_link;
      }

      // If it's a string, try to parse it as JSON first
      if (typeof RENTAL_RESALE_DATA.location_link === 'string') {
        try {
          const parsed = JSON.parse(RENTAL_RESALE_DATA.location_link);
          return parsed;
        } catch (e) {
          // If JSON parsing fails, treat it as a direct location string
          return {
            address: RENTAL_RESALE_DATA.location_link,
            // You can add default coordinates here if needed
            lat: 25.2048,
            lng: 55.2708
          };
        }
      }

      return null;
    } catch (error) {
      return null;
    }
  }, [RENTAL_RESALE_DATA.location_link]);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const flattenedAddresses = React.useMemo(() => {
    if (!RENTAL_RESALE_DATA?.addresses) return [];
    
    try {
      // Ensure addresses is an array
      const addressesArray = Array.isArray(RENTAL_RESALE_DATA.addresses) 
        ? RENTAL_RESALE_DATA.addresses 
        : [RENTAL_RESALE_DATA.addresses];

      return addressesArray
        .filter(Boolean) // Remove null/undefined
        .flat()
        .map((address) => {
          if (typeof address === "object" && address !== null) {
            return Object.values(address).join(", ");
          }
          return address;
        })
        .filter(Boolean); // Remove any null/undefined results
    } catch (error) {
      return [];
    }
  }, [RENTAL_RESALE_DATA?.addresses]);

  const normalizedAmenities = React.useMemo(() => {
    if (!RENTAL_RESALE_DATA?.amenities) return [];
    
    try {
      // Ensure amenities is an array
      const amenitiesArray = Array.isArray(RENTAL_RESALE_DATA.amenities) 
        ? RENTAL_RESALE_DATA.amenities 
        : [RENTAL_RESALE_DATA.amenities];

      return amenitiesArray
        .filter(Boolean) // Remove null/undefined
        .map((item) => {
          if (Array.isArray(item)) {
            return item[0]; // Extract the first element if it's an array
          } else if (typeof item === "object" && item !== null) {
            return Object.values(item)[0]; // Extract the first value if it's an object
          }
          return item; // Return the item as-is if it's already a string
        })
        .filter(Boolean); // Remove any null/undefined results
    } catch (error) {
      return [];
    }
  }, [RENTAL_RESALE_DATA?.amenities]);

  const normalizedLanguages = React.useMemo(() => {
    if (!RENTAL_RESALE_DATA?.languages) return [];
    
    try {
      // Ensure languages is an array
      const languagesArray = Array.isArray(RENTAL_RESALE_DATA.languages) 
        ? RENTAL_RESALE_DATA.languages 
        : [RENTAL_RESALE_DATA.languages];

      return languagesArray
        .filter(Boolean) // Remove null/undefined
        .map((item) => {
          if (Array.isArray(item)) {
            return item[0]; // Extract the first element if it's an array
          } else if (typeof item === "object" && item !== null) {
            return Object.values(item)[0]; // Extract the first value if it's an object
          }
          return item; // Return the item as-is if it's already a string
        })
        .filter(Boolean); // Remove any null/undefined results
    } catch (error) {
      return [];
    }
  }, [RENTAL_RESALE_DATA?.languages]);

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
        // Create query parameters based on current property
        const queryParams = new URLSearchParams();
        
        // Add property type (rental/resale)
        if (Array.isArray(RENTAL_RESALE_DATA.tags)) {
          if (RENTAL_RESALE_DATA.tags.includes("6")) {
            queryParams.append("type", "resale");
          } else if (RENTAL_RESALE_DATA.tags.includes("5")) {
            queryParams.append("type", "rental");
          }
        } else {
          queryParams.append("type", RENTAL_RESALE_DATA.tags === "6" ? "resale" : "rental");
        }

        // Add location
        if (RENTAL_RESALE_DATA.location) {
          queryParams.append("location", RENTAL_RESALE_DATA.location);
        }

        // Add price range (±20% of current price)
        const currentPrice = RENTAL_RESALE_DATA.amount.amount;
        const priceMin = Math.floor(currentPrice * 0.8);
        const priceMax = Math.ceil(currentPrice * 1.2);
        queryParams.append("price_min", priceMin);
        queryParams.append("price_max", priceMax);

        // Add bedrooms and bathrooms if available
        if (RENTAL_RESALE_DATA.bedroom) {
          queryParams.append("bedrooms", RENTAL_RESALE_DATA.bedroom);
        }
        if (RENTAL_RESALE_DATA.bathroom) {
          queryParams.append("bathrooms", RENTAL_RESALE_DATA.bathroom);
        }

        // Add area range (±20% of current area)
        if (RENTAL_RESALE_DATA.sq_ft) {
          const currentArea = parseInt(RENTAL_RESALE_DATA.sq_ft);
          const areaMin = Math.floor(currentArea * 0.8);
          const areaMax = Math.ceil(currentArea * 1.2);
          queryParams.append("sq_ft_min", areaMin);
          queryParams.append("sq_ft_max", areaMax);
        }

        const response = await fetch(`${RENTAL_RESALE_RELATED_API}?${queryParams.toString()}`);
        const data = await response.json();
        
        // Filter out the current property from the results
        const filteredData = data.filter(property => property.id !== RENTAL_RESALE_DATA.id);
        
        setRelatedProperties(filteredData);
      } catch (error) {
        // Silent error handling
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedProperties();
  }, [RENTAL_RESALE_DATA]);

  const handleReadMore = (slug) => {
    window.location.href = `/rental-resale/${slug}`;
  };

  // Add error boundary
  if (!RENTAL_RESALE_DATA) {
    return <div>Loading...</div>;
  }

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
                {isClient && renderGalleryImage(image, index)}
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
              {isClient && galleryImages[0] && renderGalleryImage(galleryImages[0], 0, true)}
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
                  {isClient && renderGalleryImage(image, index + 1)}
                </div>
              ))}
              {galleryImages.length > 4 && (
                <div className={styles.smallImage}>
                  {isClient && renderGalleryImage(galleryImages[4], 4)}
                </div>
              )}
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
                  {locationData ? (
                    <Map location_link={locationData} />
                  ) : (
                    <div className={styles.mapPlaceholder}>
                      <div className={styles.errorMessage}>Location data not available</div>
                      <div className={styles.sectionTitleBanner}>
                        <span className={styles.sectionTitleBannerText}>Location Map</span>
                      </div>
                    </div>
                  )}
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
                  {locationData ? (
                    <Map location_link={locationData} />
                  ) : (
                    <div className={styles.mapPlaceholder}>
                      <div className={styles.errorMessage}>Location data not available</div>
                      <div className={styles.sectionTitleBanner}>
                        <span className={styles.sectionTitleBannerText}>Location Map</span>
                      </div>
                    </div>
                  )}
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
                        src={
                          property.gallery_images &&
                          JSON.parse(property.gallery_images)[0]
                            ? `${
                                process.env.NEXT_PUBLIC_API_URL
                              }/storage/${decodeImageUrl(
                                JSON.parse(property.gallery_images)[0]
                              )}`
                            : defaultImage
                        }
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
                console.log(property),
                <div
                  key={index}
                  className={styles.propertyCardLink}
                  onClick={() => handleReadMore(property.slug)}
                  style={{ cursor: "pointer" }}
                >
                  <div className={styles.propertyCard}>
                    <div className={styles.imageContainer}>
                      <Image
                        src={
                          property.gallery_images &&
                          JSON.parse(property.gallery_images)[0]
                            ? `${
                                process.env.NEXT_PUBLIC_API_URL
                              }/storage/${decodeImageUrl(
                                JSON.parse(property.gallery_images)[0]
                              )}`
                            : defaultImage
                        }
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
      
      </div>
    </>
  );
};

// Add error boundary wrapper
const RentalResaleShowWithErrorBoundary = (props) => {
  try {
    return <RentalResaleShow {...props} />;
  } catch (error) {
    return <div>Something went wrong. Please try again later.</div>;
  }
};

export default RentalResaleShowWithErrorBoundary;
