import React, { useState, useEffect, useRef } from "react";
import Styles from "./RentalList.module.css";
import Image from "next/image";
import defaultImage from "../../assets/img/default.webp";
import { BsWhatsapp } from "react-icons/bs";
import callVector from "../../assets/img/call.svg";
import agentifno from "../../assets/img/agentinfo.png";
import { useRouter } from "next/router";
import { RENTAL_RESALE, FILTER_RENTAL_RESALE_API } from "@/routes/apiRoutes";
import axios from "axios";
import { HiOutlineMail } from "react-icons/hi";
import homeIcon from "../../assets/img/house-property-svgrepo-com.svg";
import SearchRental from "../SearchRental/SearchRental";
import RangeInputPopup from "../SearchSection/RangeInputPopup";

const Rental_Resale = () => {
  const [cardData, setCardData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const slideRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [filters, setFilters] = useState(null);
  const [showPricePopup, setShowPricePopup] = useState(false);
  const [showSqFtPopup, setShowSqFtPopup] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({
    price: "",
    sqFt: ""
  });
  const sliderRef = useRef(null);
  const propertyCardRef = useRef(null);
  const [slideOffset, setSlideOffset] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3);
  const [maxSlide, setMaxSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Filter options for SearchRental component
  const filterOptions = {
    propertyTypes: ["Apartment", "Villa", "Townhouse", "Penthouse", "Land"],
    bedrooms: ["studio", 1, 2, 3, 4, "4+"],
    bathrooms: [1, 2, 3, 4, "4+"]
  };
  // Move topProperties definition before useEffect
  const topProperties = cardData.filter((property) => property.top === 1 || property.top === true);


  useEffect(() => {
    setIsClient(true); // Ensures this runs only on the client
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const calculateLayout = () => {
      if (propertyCardRef.current && sliderRef.current) {
        const cardWidth = propertyCardRef.current.offsetWidth;
        const gap = 35;
        const currentSlideOffset = cardWidth + gap;
        setSlideOffset(currentSlideOffset);

        const containerWidth = sliderRef.current.offsetWidth;
        const currentVisibleItems = Math.max(1, Math.floor(containerWidth / currentSlideOffset));
        setVisibleItems(currentVisibleItems);

        if (topProperties.length > 0) {
          const newMaxSlide = Math.max(0, topProperties.length - currentVisibleItems);
          setMaxSlide(newMaxSlide);
        } else {
          setMaxSlide(0);
        }
      }
    };

    calculateLayout();
    window.addEventListener('resize', calculateLayout);

    return () => {
      window.removeEventListener('resize', calculateLayout);
    };
  }, [topProperties]);

  const fetchData = async (page, filterParams = null) => {
    setIsLoading(true);
    try {
      // Use FILTER_RENTAL_RESALE_API when filters are present
      const apiUrl = filterParams ? FILTER_RENTAL_RESALE_API : RENTAL_RESALE;

      // Prepare query parameters
      const queryParams = new URLSearchParams();
      queryParams.append("page", page);

      // Add filters if they exist
      if (filterParams) {
        // Handle property type
        if (filterParams.property_type) {
          queryParams.append("property_type", filterParams.property_type);
        }

        // Handle price range
        if (filterParams.price_min) {
          queryParams.append("price_min", filterParams.price_min);
        }
        if (filterParams.price_max) {
          queryParams.append("price_max", filterParams.price_max);
        }

        // Handle bedrooms
        if (filterParams.bedrooms) {
          queryParams.append("bedrooms", filterParams.bedrooms);
        }

        // Handle bathrooms
        if (filterParams.bathrooms) {
          queryParams.append("bathrooms", filterParams.bathrooms);
        }

        // Handle area (sq_ft) range
        if (filterParams.sq_ft_min) {
          queryParams.append("sq_ft_min", filterParams.sq_ft_min);
        }
        if (filterParams.sq_ft_max) {
          queryParams.append("sq_ft_max", filterParams.sq_ft_max);
        }

        // Handle location search
        if (filterParams.location) {
          queryParams.append("location", filterParams.location);
        }
      }

      const response = await axios.get(`${apiUrl}?${queryParams.toString()}`);
      const data = response.data.data;
      setCardData(Array.isArray(data) ? data : [data]);
      setCurrentPage(response.data.current_page);
      setTotalPages(response.data.last_page);
    } catch (error) {
      console.error("Error fetching data:", error);
      setCardData([]); // Clear data on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, filters);
  }, [currentPage, filters]);

  const handleReadMore = (slug) => {
    router.push(`/rental/${slug}`);
  };

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      router.push({
        pathname: router.pathname,
        query: { ...router.query, page: `page-${page}` }
      });
    }
  };

  const decodeImageUrl = (url) => {
    return decodeURIComponent(url);
  };

  const getFirstImageSrc = (galleryImages) => {
    if (!galleryImages) {
      return defaultImage;
    }
    try {
      const images = JSON.parse(galleryImages);
      if (Array.isArray(images) && images.length > 0 && images[0]) {
        return `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(
          images[0]
        )}`;
      }
    } catch (e) {
      // Fallback to default image if JSON is invalid
    }
    return defaultImage;
  };

  const parseGalleryImages = (galleryImagesString) => {
    if (!galleryImagesString) {
      return [];
    }
    try {
      const images = JSON.parse(galleryImagesString);
      return Array.isArray(images) ? images : [];
    } catch (e) {
      return [];
    }
  };

  const handleSortChange = (sortOption) => {
    // Implement sorting logic based on sortOption
    let sortedData = [...cardData];
    switch (sortOption) {
      case "newest":
        sortedData.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        break;
      case "oldest":
        sortedData.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
        break;
      case "priceHigh":
        sortedData.sort((a, b) => b.amount.amount - a.amount.amount);
        break;
      case "priceLow":
        sortedData.sort((a, b) => a.amount.amount - b.amount.amount);
        break;
      default:
        break;
    }
    setCardData(sortedData);
  };

  const handleTouchStart = (e) => {
    e.stopPropagation();
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    e.stopPropagation();
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = (images) => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentImageIndex < images.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }

    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleFilterChange = (newFilters) => {
    // If newFilters is null, clear all filters
    if (!newFilters) {
      setCurrentFilters({
        price: "",
        sqFt: ""
      });
      setFilters(null);
      setCurrentPage(1);
      return;
    }

    // Update current filters state with the raw filter values
    setCurrentFilters(prev => ({
      ...prev,
      price: newFilters?.price || "",
      sqFt: newFilters?.sqFt || ""
    }));

    // The newFilters object already contains the backend-formatted filters
    // Just remove null or empty values
    const filteredParams = Object.fromEntries(
      Object.entries(newFilters).filter(([_, v]) => v !== null && v !== "")
    );

    setFilters(filteredParams);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const formatRangeDisplay = (value, isPrice = false) => {
    if (!value) return "";
    const [min, max] = value.split("-");

    if (min && max) {
      if (isPrice) {
        return `$${Number(min).toLocaleString()} - $${Number(max).toLocaleString()}`;
      }
      return `${Number(min).toLocaleString()} - ${Number(max).toLocaleString()}`;
    }
    if (min) {
      if (isPrice) {
        return `From $${Number(min).toLocaleString()}`;
      }
      return `From ${Number(min).toLocaleString()}`;
    }
    if (max) {
      if (isPrice) {
        return `Up to $${Number(max).toLocaleString()}`;
      }
      return `Up to ${Number(max).toLocaleString()}`;
    }
    return "";
  };

  // Helper: clone slides for infinite effect
  const getInfiniteSlides = () => {
    // If not enough slides for infinite, just return originals
    if (topProperties.length <= visibleItems) return topProperties;
    const clonesBefore = topProperties.slice(-visibleItems);
    const clonesAfter = topProperties.slice(0, visibleItems);
    return [...clonesBefore, ...topProperties, ...clonesAfter];
  };
  const infiniteSlides = getInfiniteSlides();
  const isInfinite = topProperties.length > visibleItems;

  // Adjusted currentSlide for infinite logic
  const [slickCurrent, setSlickCurrent] = useState(isInfinite ? visibleItems : 0);

  useEffect(() => {
    setSlickCurrent(isInfinite ? visibleItems : 0);
  }, [visibleItems, topProperties.length]);

  const handleSlickPrev = (e) => {
    e.stopPropagation();
    if (isTransitioning) return;
    setIsTransitioning(true);
    setSlickCurrent((prev) => prev - visibleItems);
  };
  const handleSlickNext = (e) => {
    e.stopPropagation();
    if (isTransitioning) return;
    setIsTransitioning(true);
    setSlickCurrent((prev) => prev + visibleItems);
  };

  const handleSlickTransitionEnd = () => {
    setIsTransitioning(false);
    if (!isInfinite) return;
    // Jump without animation if at clone
    if (slickCurrent === 0) {
      setSlickCurrent(topProperties.length);
    } else if (slickCurrent === topProperties.length + visibleItems) {
      setSlickCurrent(visibleItems);
    }
  };

  const handleSlickTouchStart = (e) => {
    e.stopPropagation();
    setTouchStart(e.touches[0].clientX);
  };
  const handleSlickTouchMove = (e) => {
    e.stopPropagation();
    setTouchEnd(e.touches[0].clientX);
  };
  const handleSlickTouchEnd = (e) => {
    e.stopPropagation();
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) handleSlickNext(e);
    else if (isRightSwipe) handleSlickPrev(e);
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <>
      <div className="container">
      <h1 className={Styles.main_title}>Ready-to-Rent or Ready-to-Own Properties in Dubai</h1>
      <h2 className={Styles.second_title}>rentals and resale properties with great ROI potential</h2>
        {/* Sidebar elements moved out of the row */}
        <div className={Styles.sidebarWrapper}>
          <div className={Styles.sidebarqr}> {/* Sidebar QR code */}</div>
          <div className={Styles.sharediv}> {/* Share div */}</div>
          <div className={Styles.sidebarlocation}>
            {" "}
            {/* Sidebar location */}
          </div>
        </div>

        <div className="row">
          {!isMobile && topProperties.length > 0 && (
            <div className={Styles.title_top}>
              <span>Top Listings</span>
            </div>
          )}

          {!isMobile && (
            <div className={Styles.sliderWrapper} ref={sliderRef}>
              <button
                className={`${Styles.sliderArrow} ${Styles.prevArrow}`}
                onClick={handleSlickPrev}
                disabled={isTransitioning}
                style={{ opacity: isTransitioning ? 0.5 : 1 }}
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
                className={Styles.propertyGrid}
                style={{
                  transform: `translateX(-${slickCurrent * slideOffset}px)`,
                  transition: isTransitioning ? 'transform 0.3s ease-out' : 'none'
                }}
                onTransitionEnd={handleSlickTransitionEnd}
                onTouchStart={handleSlickTouchStart}
                onTouchMove={handleSlickTouchMove}
                onTouchEnd={handleSlickTouchEnd}
              >
                {infiniteSlides.map((property, index) => (
                  <div
                    key={property.id + '-' + index}
                    className={Styles.propertyCardLink}
                    ref={index === (isInfinite ? visibleItems : 0) ? propertyCardRef : null}
                    onClick={() => handleReadMore(property.slug)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className={Styles.propertyCard}>
                      <div className={Styles.imageContainer}>
                        <Image
                          src={getFirstImageSrc(property.gallery_images)}
                          alt={property.title || "Default Property Image"}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className={Styles.propertyImage}
                          priority
                          unoptimized
                        />
                        {property.exclusive && (
                          <span className={Styles.exclusive}>Exclusive</span>
                        )}
                        {property.top && (
                          <span className={Styles.topBadge}>Top</span>
                        )}
                      </div>

                      <div className={Styles.propertyInfo}>
                        <h3 className={Styles.title}>{property.title}</h3>
                        <p className={Styles.location}>
                          {property.locations && property.locations.length > 0
                            ? property.locations[0].title
                            : property.subtitle || property.location || ''}
                        </p>

                        <div className={Styles.features}>
                          <div className={Styles.feature}>
                            <Image
                              src={require("/assets/img/bad.svg")}
                              alt="Bed Icon"
                              width={24}
                              height={24}
                            />
                            <span>{property.bedroom} Br</span>
                          </div>
                          <div className={Styles.feature}>
                            <Image
                              src={require("/assets/img/bath.svg")}
                              alt="Bath Icon"
                              width={24}
                              height={24}
                            />
                            <span>{property.bathroom} Ba</span>
                          </div>
                          <div className={Styles.feature}>
                            <Image
                              src={require("/assets/img/place.svg")}
                              alt="Area Icon"
                              width={24}
                              height={24}
                            />

                            <span>{property.sq_ft} Sq.m</span>
                          </div>
                          <div className={Styles.feature}>
                            <Image
                              src={require("/assets/img/garage.svg")}
                              alt="Car Icon"
                              width={24}
                              height={24}
                            />
                            <span>{property.garage} Gr</span>
                          </div>
                        </div>

                        <div className={Styles.priceRow}>
                          <span className={Styles.price}>
                            USD{" "}
                            {property.amount?.amount?.toLocaleString() || "N/A"}
                          </span>
                          <span className={Styles.price}>
                            AED{" "}
                            {property.amount?.amount_dirhams?.toLocaleString() ||
                              "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className={`${Styles.sliderArrow} ${Styles.nextArrow}`}
                onClick={handleSlickNext}
                disabled={isTransitioning}
                style={{ opacity: isTransitioning ? 0.5 : 1 }}
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

          <SearchRental
            onFilterChange={handleFilterChange}
            filterOptions={filterOptions}
            showPricePopup={showPricePopup}
            setShowPricePopup={setShowPricePopup}
            showSqFtPopup={showSqFtPopup}
            setShowSqFtPopup={setShowSqFtPopup}
            currentFilters={currentFilters}
          />

          {showPricePopup && (
            <div className={Styles.popupContainer} onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowPricePopup(false);
              }
            }}>
              <RangeInputPopup
                isOpen={showPricePopup}
                onClose={() => setShowPricePopup(false)}
                onApply={(value) => {
                  handleFilterChange({ ...currentFilters, price: value });
                }}
                title="Price Range"
                unit="USD"
                initialValue={currentFilters.price}
              />
            </div>
          )}

          {showSqFtPopup && (
            <div className={Styles.popupContainer} onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowSqFtPopup(false);
              }
            }}>
              <RangeInputPopup
                isOpen={showSqFtPopup}
                onClose={() => setShowSqFtPopup(false)}
                onApply={(value) => {
                  handleFilterChange({ ...currentFilters, sqFt: value });
                }}
                title="Area Range"
                unit="Sq.m"
                initialValue={currentFilters.sqFt}
              />
            </div>
          )}

          <div className={Styles.resaleSection}>
            <div className={Styles.resaleHeader}>

            </div>

            <div className={Styles.resaleList}>
              {cardData.map((listing) => {
                let galleryImages = [];
                try {
                  if (listing.gallery_images) {
                    const parsed = JSON.parse(listing.gallery_images);
                    if (Array.isArray(parsed)) {
                      galleryImages = parsed;
                    }
                  }
                } catch (error) {
                  // Malformed JSON, galleryImages will remain an empty array, preventing a crash.
                }
                return (
                  <div
                    key={listing.id}
                    className={Styles.resaleCard}
                    onClick={() => {
                      handleReadMore(listing.slug);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <div className={Styles.largeImage}>
                      <Image
                        src={
                          galleryImages[0]
                            ? `${process.env.NEXT_PUBLIC_API_URL
                            }/storage/${decodeImageUrl(galleryImages[0])}`
                            : defaultImage
                        }
                        alt={listing.title}
                        style={{ objectFit: "cover" }}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 580px"
                      />
                      {Array.isArray(listing.tags) ? (
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', position: 'absolute', bottom: '10px', left: '10px' }}>
                          {listing.tags.includes("6") && (
                            <div className={Styles.resaleButton} style={{ position: 'relative', zIndex: 1 }}>
                              <div className={Styles.iconGroup}>
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
                          {listing.tags.includes("5") && (
                            <div className={Styles.resaleButton} style={{ position: 'relative', zIndex: 1 }}>
                              <div className={Styles.iconGroup}>
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
                        <div className={Styles.resaleButton}>
                          <div className={Styles.iconGroup}>
                            <Image
                              src={homeIcon}
                              alt="Home"
                              width={18}
                              height={18}
                            />
                          </div>
                          <span>
                            {listing.tags === "6" ? "Resale" : "Rental"}
                          </span>
                        </div>
                      )}
                    </div>
                    {galleryImages.length > 1 && (
                      <div className={Styles.smallImagesGrid}>
                        {galleryImages.slice(1, 3).map((image, index) => (
                          <div key={index} className={Styles.smallImage}>
                            <Image
                              src={
                                image
                                  ? `${process.env.NEXT_PUBLIC_API_URL
                                  }/storage/${decodeImageUrl(image)}`
                                  : defaultImage
                              }
                              alt={`Gallery Image ${index + 1}`}
                              style={{ objectFit: "cover" }}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 40vw, 334px"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Mobile view slider */}
                    <div className={Styles.mobileImageSlider}>
                      <button
                        className={`${Styles.sliderArrow} ${Styles.prevArrow}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex((prev) => Math.max(prev - 1, 0));
                        }}
                        disabled={currentImageIndex === 0}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M15 18L9 12L15 6"
                            stroke="#FFFFFF"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <div
                        className={Styles.slideContainer}
                        ref={slideRef}
                        style={{
                          transform: `translateX(-${currentImageIndex * 100}%)`,
                          width: `${galleryImages.length * 100}%`
                        }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={(e) => {
                          e.stopPropagation();
                          handleTouchEnd(galleryImages);
                        }}
                      >
                        {galleryImages.map((image, index) => (
                          <div key={index} className={Styles.slide}>
                            <Image
                              src={
                                image
                                  ? `${process.env.NEXT_PUBLIC_API_URL
                                  }/storage/${decodeImageUrl(image)}`
                                  : defaultImage
                              }
                              alt={`Property Image ${index + 1}`}
                              fill
                              style={{ objectFit: "cover" }}
                              sizes="100vw"
                              priority={index === 0}
                            />
                          </div>
                        ))}
                      </div>
                      <button
                        className={`${Styles.sliderArrow} ${Styles.nextArrow}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex((prev) =>
                            prev + 1 < galleryImages.length ? prev + 1 : prev
                          );
                        }}
                        disabled={currentImageIndex === galleryImages.length - 1}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M9 18L15 12L9 6"
                            stroke="#FFFFFF"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <div className={Styles.slideIndicators}>
                        {galleryImages.map((_, index) => (
                          <div
                            key={index}
                            className={`${Styles.indicator} ${index === currentImageIndex ? Styles.active : ""
                              }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex(index);
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className={Styles.resaleContent}>
                      <h3>{listing.title}</h3>

                      <p className={Styles.resaleLocation}>
                        {listing.locations && listing.locations.length > 0
                          ? listing.locations[0].title
                          : listing.subtitle || listing.location || ''}
                      </p>
                      <div className={Styles.priceContainer}>
                        {isMobile && (
                          <div className={Styles.starting_price}>
                            <span>Starting Price</span>
                          </div>
                        )}
                        <p className={Styles.resalePrice}>
                          USD {listing.amount.amount?.toLocaleString() || "N/A"}
                          K
                        </p>
                        <p className={Styles.resalePrice}>
                          AED{" "}
                          {listing.amount.amount_dirhams?.toLocaleString() ||
                            "N/A"}
                          K
                        </p>
                      </div>

                      <div className={Styles.resaleStats}>
                        <div className={Styles.statGroup}>
                          <Image
                            src={require("/assets/img/bad.svg")}
                            alt="Bedrooms"
                            width={16}
                            height={16}
                          />
                          <span>{listing.bedroom} Br</span>
                        </div>
                        <div className={Styles.statSeparator}>|</div>
                        <div className={Styles.statGroup}>
                          <Image
                            src={require("/assets/img/bath.svg")}
                            alt="Bathrooms"
                            width={16}
                            height={16}
                          />
                          <span>{listing.bathroom} Ba</span>
                        </div>
                        <div className={Styles.statSeparator}>|</div>
                        <div className={Styles.statGroup}>
                          <Image
                            src={require("/assets/img/place.svg")}
                            alt="Bathrooms"
                            width={16}
                            height={16}
                          />
                          <span>{listing.sq_ft} Sq.m</span>
                        </div>
                        <div className={Styles.statSeparator}>|</div>
                        <div className={Styles.statGroup}>
                          <Image
                            src={require("/assets/img/garage.svg")}
                            alt="Area"
                            width={16}
                            height={16}
                          />
                          <span>{listing.sq_ft} Gr</span>
                        </div>
                      </div>
                      {isMobile && (
                        <div className={Styles.description}>
                          <p
                            dangerouslySetInnerHTML={{
                              __html: listing.description
                            }}
                          />
                        </div>
                      )}
                      {!isMobile && (
                        <div className={Styles.resaleDetails}>
                          {(Array.isArray(listing.details) ? listing.details.slice(0, 4) : []).map((detail, index) => (
                            <p key={index}>{detail.info}</p>
                          ))}
                        </div>
                      )}
                      {!isMobile && (
                        <div className={Styles.resaleFooter}>
                          <div className={Styles.agentInfo}>
                            <Image
                              src={listing.agent_image || agentifno}
                              alt="Agent"
                              width={40}
                              height={40}
                              className={Styles.agentImage}
                            />
                            <span>{listing.agent_title}</span>
                          </div>
                          <div className={Styles.footerActions}>
                            <button className={Styles.footerButton}>
                              <BsWhatsapp size={16} color="#34C759" />
                              <span>WhatsApp</span>
                            </button>
                            <div className={Styles.footerSeparator}>|</div>
                            <button className={Styles.footerButton}>
                              <Image src={callVector} alt="Call" />
                              <span>Call Us</span>
                            </button>
                          </div>
                        </div>
                      )}
                      {isMobile && (
                        <div className={Styles.propertyActions}>
                          <button className={Styles.actionButton_email}>
                            <HiOutlineMail size={16} color="#1A1A1A" />
                            <span>Email</span>
                          </button>
                          <button className={Styles.actionButton_call}>
                            <Image src={callVector} alt="Call" />
                            <span>Call</span>
                          </button>
                          <button className={Styles.actionButton_whatsapp}>
                            <BsWhatsapp size={16} color="#34C759" />
                            <span>WhatsApp</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={Styles.pagination}>
          {isMobile ? (
            <div className={`${Styles.mobilePagination} container`} >
             
              <div className={Styles.pageInfo}>
               <span className={Styles.pageText}>Page</span>
                <select
                  className={Styles.pageSelect}
                  value={currentPage}
                  onChange={(e) => handlePageChange(Number(e.target.value))}
                >
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <option key={page} value={page}>
                        {page}
                      </option>
                    )
                  )}
                </select>
                <span className={Styles.pageTotal}>of {totalPages}</span>
              </div>
              <button
                className={Styles.pageButtonmobile}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
                <path d="M7.70664 7.70586C8.09727 7.31523 8.09727 6.68086 7.70664 6.29023L1.70664 0.290234C1.31602 -0.100391 0.681641 -0.100391 0.291016 0.290234C-0.0996094 0.680859 -0.0996094 1.31523 0.291016 1.70586L5.58477 6.99961L0.29414 12.2934C-0.0964847 12.684 -0.0964847 13.3184 0.29414 13.709C0.684765 14.0996 1.31914 14.0996 1.70977 13.709L7.70977 7.70898L7.70664 7.70586Z" fill="#07151F"/>
                </svg>
              </button>
            </div>
          ) : (
            <>
              {/* First Page */}
              <button
                key={1}
                onClick={() => handlePageChange(1)}
                className={`${Styles.pageButton} ${
                  1 >= 100 ? Styles.paginationMany : ""
                } ${currentPage === 1 ? Styles.active : ""}`}
                disabled={isLoading}
              >
                1
              </button>

              {/* Ellipsis before the page range if needed */}
              {currentPage > 6 && <span className={Styles.ellipsis}>...</span>}

              {/* Dynamic page range: Show up to 10 pages centered around currentPage */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(
                  Math.max(1, currentPage - 5), // Start of range
                  Math.min(totalPages, currentPage + 5) // End of range
                )
                .map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`${Styles.pageButton} ${
                      page >= 100 ? Styles.paginationMany : ""
                    } ${currentPage === page ? Styles.active : ""}`}
                    disabled={isLoading}
                  >
                    {page}
                  </button>
                ))}

              {/* Ellipsis after the page range if needed */}
              {currentPage < totalPages - 5 && (
                <span className={Styles.ellipsis}>...</span>
              )}

              {/* Last Page (if not already in range) */}
              {totalPages > 1 && currentPage < totalPages - 5 && (
                <button
                  key={totalPages}
                  onClick={() => handlePageChange(totalPages)}
                  className={`${Styles.pageButton} ${
                    totalPages >= 100 ? Styles.paginationMany : ""
                  } ${currentPage === totalPages ? Styles.active : ""}`}
                  disabled={isLoading}
                >
                  {totalPages}
                </button>
              )}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className={Styles.pageButton}
              >
                Next
              </button>
            </>
          )}
        </div>
          </div>
        </div>
        {isMobile && topProperties.length > 0 && (
          <div className={Styles.title_top}>
            <span>Recommended for You</span>
          </div>
        )}
        {isMobile && (
          <div
            className={Styles.sliderWrapper}
            onTouchStart={(e) => {
              const touch = e.touches[0];
              setTouchStart(touch.clientX);
            }}
            onTouchMove={(e) => {
              const touch = e.touches[0];
              setTouchEnd(touch.clientX);
            }}
            onTouchEnd={() => {
              if (!touchStart || !touchEnd) return;
              const distance = touchStart - touchEnd;
              const isLeftSwipe = distance > 50;
              const isRightSwipe = distance < -50;

              if (isLeftSwipe && currentSlide < Math.ceil(topProperties.length / 2) - 1) {
                setCurrentSlide(prev => prev + 1);
              }
              if (isRightSwipe && currentSlide > 0) {
                setCurrentSlide(prev => prev - 1);
              }

              setTouchStart(0);
              setTouchEnd(0);
            }}
          >
            <div
              className={Styles.propertyGrid}
              style={{ transform: `translateX(-${currentSlide * 296}px)` }}
            >
              {topProperties.map((property) => (
                <div
                  key={property.id}
                  className={Styles.propertyCardLink}
                  onClick={() => handleReadMore(property.slug)}
                  style={{ cursor: "pointer" }}
                >
                  <div className={Styles.propertyCard}>
                    <div className={Styles.imageContainer}>
                      <Image
                        src={getFirstImageSrc(property.gallery_images)}
                        alt={property.title || "Default Property Image"}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={Styles.propertyImage}
                        priority
                        unoptimized
                      />
                      {property.exclusive && (
                        <span className={Styles.exclusive}>Exclusive</span>
                      )}
                      {property.top && (
                        <span className={Styles.topBadge}>Top</span>
                      )}
                    </div>

                    <div className={Styles.propertyInfo}>
                      <h3 className={Styles.title}>{property.title}</h3>
                      <p className={Styles.location}>
                        {property.locations && property.locations.length > 0
                          ? property.locations[0].title
                          : property.subtitle || property.location || ''}
                      </p>

                      <div className={Styles.features}>
                        <div className={Styles.feature}>
                          <Image
                            src={require("/assets/img/bad.svg")}
                            alt="Bed Icon"
                            width={24}
                            height={24}
                          />
                          <span>{property.bedroom} Br</span>
                        </div>
                        <div className={Styles.feature}>
                          <Image
                            src={require("/assets/img/bath.svg")}
                            alt="Bath Icon"
                            width={24}
                            height={24}
                          />
                          <span>{property.bathroom} Ba</span>
                        </div>
                        <div className={Styles.feature}>
                          <Image
                            src={require("/assets/img/place.svg")}
                            alt="Area Icon"
                            width={24}
                            height={24}
                          />
                          <span>{property.sq_ft} Sq.m</span>
                        </div>
                        <div className={Styles.feature}>
                          <Image
                            src={require("/assets/img/garage.svg")}
                            alt="Car Icon"
                            width={24}
                            height={24}
                          />
                          <span>{property.garage} Gr</span>
                        </div>
                      </div>

                      <div className={Styles.priceRow}>
                        <span className={Styles.price}>
                          USD{" "}
                          {property.amount?.amount?.toLocaleString() || "N/A"}
                        </span>
                        <span className={Styles.price}>
                          AED{" "}
                          {property.amount?.amount_dirhams?.toLocaleString() ||
                            "N/A"}
                        </span>
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

export default Rental_Resale;
