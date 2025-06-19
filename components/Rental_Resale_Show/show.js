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
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const galleryRef = useRef(null);
  const imageRef = useRef(null);
  const [showCopyAlert, setShowCopyAlert] = useState(false);

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
  const getAgentPhotoUrl = (photoData) => {
    if (!photoData) {
      return defaultImage;
    }
    try {
      const parsed = JSON.parse(photoData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const imagePath = parsed[0];
        return `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(imagePath)}`;
      }
    } catch (error) {
      // Fallback for plain string or other formats
      return `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(photoData)}`;
    }
    return defaultImage;
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          setShowCopyAlert(true);
          setTimeout(() => {
            setShowCopyAlert(false);
          }, 3000); // Hide after 3 seconds
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          // You might want a styled alert for errors too
          alert("Failed to copy link.");
        });
    } else {
      // And for this case as well
      alert("Clipboard API not available on this browser.");
    }
  };
  // Parse gallery images
  const getRelatedPropertyImageUrl = (property) => {
    if (!property.gallery_images) {
      return defaultImage;
    }

    try {
      const images = JSON.parse(property.gallery_images);
      if (Array.isArray(images) && images.length > 0) {
        return `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(
          images[0]
        )}`;
      }
    } catch (error) {
      // If parsing fails, assume it might be a plain string
      return `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(
        property.gallery_images
      )}`;
    }

    return defaultImage;
  };

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

  const parsedDetails = React.useMemo(() => {
    if (!RENTAL_RESALE_DATA?.details) {
      return [];
    }
    try {
      if (Array.isArray(RENTAL_RESALE_DATA.details)) {
        return RENTAL_RESALE_DATA.details;
      }
      if (typeof RENTAL_RESALE_DATA.details === 'string') {
        const parsed = JSON.parse(RENTAL_RESALE_DATA.details);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (error) {
      return [];
    }
  }, [RENTAL_RESALE_DATA?.details]);

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

  // Handle keyboard navigation
  useEffect(() => {
    if (!isGalleryOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          closeGallery();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case '+':
        case '=':
          zoomIn();
          break;
        case '-':
          zoomOut();
          break;
        case '0':
          resetZoom();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGalleryOpen, currentImageIndex, scale]);

  // Handle wheel zoom
  const handleWheel = (e) => {
    if (!isGalleryOpen) return;
    e.preventDefault();
    
    const delta = e.deltaY * -0.01;
    const newScale = Math.min(Math.max(0.5, scale + delta), 3);
    setScale(newScale);
  };

  // Handle mouse drag
  const handleMouseDown = (e) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || scale <= 1) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Gallery controls
  const openGallery = (index) => {
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    document.body.style.overflow = '';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 3));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.5, 0.5));
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Render gallery image
  const renderGalleryImage = (image, index, isMain = false) => {
    if (!image) return null;
    
    try {
      const imageUrl = getImageUrl(image);
      if (!imageUrl) return null;
      
      return (
        <div
          key={`gallery-${index}`}
          className={styles.galleryItem}
          onClick={() => openGallery(index)}
          style={{ cursor: 'pointer', width: '100%', height: '100%' }}
        >
          <img
            src={imageUrl}
            alt={`${RENTAL_RESALE_DATA?.title || ''} - Image ${index + 1}`}
            title={`${RENTAL_RESALE_DATA?.title || ''} - Image ${index + 1}`}
            loading={isMain || index === 0 ? "eager" : "lazy"}
            className={styles.galleryImage}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              e.target.src = defaultImage;
            }}
          />
        </div>
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
      {showCopyAlert && (
        <div className={styles.copyAlert}>Link copied to clipboard!</div>
      )}
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
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="22" viewBox="0 0 13 22" fill="none">
<path d="M0.941016 9.94023C0.355078 10.5262 0.355078 11.4777 0.941016 12.0637L9.94102 21.0637C10.527 21.6496 11.4785 21.6496 12.0645 21.0637C12.6504 20.4777 12.6504 19.5262 12.0645 18.9402L4.12383 10.9996L12.0598 3.05898C12.6457 2.47305 12.6457 1.52148 12.0598 0.935547C11.4738 0.349609 10.5223 0.349609 9.93633 0.935547L0.936329 9.93555L0.941016 9.94023Z" fill="white"/>
</svg>
            </button>
            <button
              onClick={nextSlide}
              className={`${styles.sliderArrow} ${styles.nextArrow}`}
            >
             <svg xmlns="http://www.w3.org/2000/svg" width="13" height="22" viewBox="0 0 13 22" fill="none">
<path d="M12.059 12.0598C12.6449 11.4738 12.6449 10.5223 12.059 9.93633L3.05898 0.936328C2.47305 0.350391 1.52148 0.350391 0.935547 0.936328C0.349609 1.52227 0.349609 2.47383 0.935547 3.05977L8.87617 11.0004L0.940234 18.941C0.354296 19.527 0.354296 20.4785 0.940234 21.0645C1.52617 21.6504 2.47773 21.6504 3.06367 21.0645L12.0637 12.0645L12.059 12.0598Z" fill="white"/>
</svg>
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
              <div className={`${styles.col} col-md-8`}>
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
                    {parsedDetails.map((detail, index) => {
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
              <div className={`${styles.col } col-md-4`}>
                {/* Contact Information Section */}
                <div className={styles.sharediv}>
                  <div className={styles.content_sharediv}>
                    <div className={styles.imageContainer_share}>
                     
                      <img
                        src={getAgentPhotoUrl(RENTAL_RESALE_DATA.agent_photo)}
                        alt={RENTAL_RESALE_DATA.title}
                        title={`${RENTAL_RESALE_DATA.agent_title || 'Agent'} - ${RENTAL_RESALE_DATA.title}`}
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
                      <span className={styles.email}> {RENTAL_RESALE_DATA.agent_email}</span>
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
                  <button className={styles.shareButton} onClick={handleShare}>
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
                      title={`QR Code for ${RENTAL_RESALE_DATA.title}`}
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
                      <div className={`${styles.modalContent} container`} >
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
                    {parsedDetails.map((detail, index) => {
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
               
                <div className={styles.sharediv}>
                  <div className={styles.content_sharediv}>
                    <div className={styles.imageContainer_share}>
                      <img
                        src={getAgentPhotoUrl(RENTAL_RESALE_DATA.agent_photo)}
                        alt={RENTAL_RESALE_DATA.title}
                        title={`${RENTAL_RESALE_DATA.agent_title || 'Agent'} - ${RENTAL_RESALE_DATA.title}`}
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
                      <span className={styles.email}> {RENTAL_RESALE_DATA.agent_email}</span>
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
                  <button className={styles.shareButton} onClick={handleShare}>
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
                      title={`QR Code for ${RENTAL_RESALE_DATA.title}`}
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
                      <div className={`${styles.modalContent} container`} >
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
                        src={(() => {
                            let firstImage = null;
                            if (property.gallery_images) {
                              try {
                                const images = JSON.parse(property.gallery_images);
                                if (Array.isArray(images) && images.length > 0) {
                                  firstImage = images[0];
                                }
                              } catch (e) {
                                if (typeof property.gallery_images === 'string' && property.gallery_images.trim()) {
                                  firstImage = property.gallery_images.trim();
                                }
                              }
                            }
                            return firstImage
                              ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(firstImage)}`
                              : defaultImage;
                          })()}
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
                      <p className={styles.location}> {property.locations && property.locations.length > 0
                            ? property.locations[0].title
                            : property.subtitle || property.location || ''}</p>
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
                        src={getRelatedPropertyImageUrl(property)}
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
                      <p className={styles.subtitle}>{property.subtitle}</p>
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
                      <div className={styles.line}></div>
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

      {/* Custom Gallery Modal */}
      {isGalleryOpen && (
        <div 
          className={styles.galleryModal}
          onWheel={handleWheel}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className={styles.galleryOverlay} onClick={closeGallery} />
          
          <div className={styles.galleryContent}>
            <button 
              className={`${styles.galleryButton} ${styles.closeButton}`}
              onClick={closeGallery}
            >
              ×
            </button>
            
            <button 
              className={`${styles.galleryButton} ${styles.prevButton}`}
              onClick={prevImage}
            >
              ‹
            </button>
            
            <div 
              className={styles.galleryImageContainer}
              ref={galleryRef}
              onMouseDown={handleMouseDown}
            >
              <img
                ref={imageRef}
                src={getImageUrl(galleryImages[currentImageIndex])}
                alt={`${RENTAL_RESALE_DATA?.title || ''} - Image ${currentImageIndex + 1}`}
                style={{
                  transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                  cursor: scale > 1 ? 'move' : 'default'
                }}
                className={styles.galleryModalImage}
              />
            </div>
            
            <button 
              className={`${styles.galleryButton} ${styles.nextButton}`}
              onClick={nextImage}
            >
              ›
            </button>

            <div className={styles.galleryControls}>
              <button onClick={zoomIn} className={styles.controlButton}>+</button>
              <button onClick={zoomOut} className={styles.controlButton}>-</button>
              <button onClick={resetZoom} className={styles.controlButton}>Reset</button>
              <span className={styles.imageCounter}>
                {currentImageIndex + 1} / {galleryImages.length}
              </span>
            </div>
          </div>
        </div>
      )}
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
