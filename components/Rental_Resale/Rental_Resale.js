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
import SubscribeSection from "../SubscribeSection/SubscribeSection";
import homeIcon from "../../assets/img/house-property-svgrepo-com.svg";
import SearchRental from "../SearchRental/SearchRental";

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

  // Filter options for SearchRental component
  const filterOptions = {
    propertyTypes: ['Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Land'],
    bedrooms: [1, 2, 3, 4, 5, 6, 7, 8],
    bathrooms: [1, 2, 3, 4, 5, 6, 7, 8]
  };

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

  const fetchData = async (page, filterParams = null) => {
    setIsLoading(true);
    try {
      // Use FILTER_RENTAL_RESALE_API when filters are present
      const apiUrl = filterParams ? FILTER_RENTAL_RESALE_API : RENTAL_RESALE;
      
      // Prepare query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      
      // Add filters if they exist
      if (filterParams) {
        Object.entries(filterParams).forEach(([key, value]) => {
          if (value !== null && value !== '') {
            queryParams.append(key, value);
          }
        });
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

  const topProperties = cardData.filter((property) => property.top === 1);

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
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
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  return (
    <>
      <div className="container mt-3">
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
            <div className={Styles.sliderWrapper}>
              <button
                className={`${Styles.sliderArrow} ${Styles.prevArrow}`}
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
                className={Styles.propertyGrid}
                style={{ transform: `translateX(-${currentSlide * 33.33}%)` }}
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
                          {property.location_link}
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

                            <span>{property.sq_ft} Sq.Ft</span>
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
                            {property.amount?.amount_dirhams?.toLocaleString() || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className={`${Styles.sliderArrow} ${Styles.nextArrow}`}
                onClick={() =>
                  setCurrentSlide((prev) =>
                    prev + 1 >= topProperties.length - 2 ? prev : prev + 1
                  )
                }
                disabled={currentSlide >= topProperties.length - 2}
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
          />

          <div className={Styles.resaleSection}>
            <div className={Styles.resaleHeader}>
              {isMobile && (
                <div className={Styles.search_result}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className={Styles.search_result_text}>
                      Search Results
                    </span>
                    <div className={Styles.search_result_sort}>
                      <span>Sort:</span>
                      <select
                        className={Styles.sort_dropdown}
                        onChange={(e) => handleSortChange(e.target.value)}
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="priceHigh">Price: High to Low</option>
                        <option value="priceLow">Price: Low to High</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={Styles.resaleList}>
              {cardData.map((listing) => {
                const galleryImages = JSON.parse(
                  listing.gallery_images || "[]"
                );

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
                            ? `${
                                process.env.NEXT_PUBLIC_API_URL
                              }/storage/${decodeImageUrl(galleryImages[0])}`
                            : defaultImage
                        }
                        alt={listing.title}
                        style={{ objectFit: "cover" }}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 580px"
                      />
                      <div className={Styles.resaleButton}>
                        <div className={Styles.iconGroup}>
                          <Image src={homeIcon} alt="Home" width={18} height={18} />
                        </div>
                        <span>{listing.tags === 6 ? 'Rental' : 'Resale'}</span>
                      </div>
                    </div>
                    <div className={Styles.smallImagesGrid}>
                      {galleryImages.slice(1, 3).map((image, index) => (
                        <div key={index} className={Styles.smallImage}>
                          <Image
                            src={
                              image
                                ? `${
                                    process.env.NEXT_PUBLIC_API_URL
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

                    {/* Mobile view slider */}
                    <div className={Styles.mobileImageSlider}>
                      <button
                        className={`${Styles.sliderArrow} ${Styles.prevArrow}`}
                        onClick={(e) => {
                          e.stopPropagation(); // Add this line
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
                          transform: `translateX(-${currentImageIndex * 100}%)`
                        }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={() => handleTouchEnd(galleryImages)}
                      >
                        {galleryImages.map((image, index) => (
                          <div key={index} className={Styles.slide}>
                            <Image
                              src={
                                image
                                  ? `${
                                      process.env.NEXT_PUBLIC_API_URL
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
                          e.stopPropagation(); // Add this line
                          setCurrentImageIndex((prev) =>
                            prev + 1 < galleryImages.length ? prev + 1 : prev
                          );
                        }}
                        disabled={
                          currentImageIndex === galleryImages.length - 1
                        }
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
                            className={`${Styles.indicator} ${
                              index === currentImageIndex ? Styles.active : ""
                            }`}
                            onClick={() => setCurrentImageIndex(index)}
                          />
                        ))}
                      </div>
                    </div>

                    <div className={Styles.resaleContent}>
                      <h4>{listing.title}</h4>

                      <p className={Styles.resaleLocation}>
                        {listing.subtitle}
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
                          <span>{listing.sq_ft} Sq.Ft</span>
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
                          <p dangerouslySetInnerHTML={{ __html: listing.description }} />
                        </div>
                      )}
                      {!isMobile && (
                        <div className={Styles.resaleDetails}>
                          {listing.details.slice(0, 4).map((detail, index) => (
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
                              <BsWhatsapp size={20} color="#34C759" />
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
                            <HiOutlineMail size={20} color="#1A1A1A" />
                            <span>Email</span>
                          </button>
                          <button className={Styles.actionButton_call}>
                            <Image src={callVector} alt="Call" />
                            <span>Call</span>
                          </button>
                          <button className={Styles.actionButton_whatsapp}>
                            <BsWhatsapp size={20} color="#34C759" />
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`${Styles.pageButton} ${
                      currentPage === page ? Styles.active : ""
                    }`}
                    disabled={isLoading}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className={Styles.pageButton}
              >
                Next
              </button>
            </div>
          </div>
        </div>
        {isMobile && topProperties.length > 0 && (
          <div className={Styles.title_top}>
            <span>Recommended for You</span>
          </div>
        )}
        {isMobile && (
          <div className={Styles.sliderWrapper}>
            <button
              className={`${Styles.sliderArrow} ${Styles.prevArrow}`}
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
              className={Styles.propertyGrid}
              style={{ transform: `translateX(-${currentSlide * 33.33}%)` }}
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
                        {property.location_link}
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

                          <span>{property.sq_ft} Sq.Ft</span>
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
                          {property.amount?.amount_dirhams?.toLocaleString() || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              className={`${Styles.sliderArrow} ${Styles.nextArrow}`}
              onClick={() =>
                setCurrentSlide((prev) =>
                  prev + 1 >= topProperties.length - 2 ? prev : prev + 1
                )
              }
              disabled={currentSlide >= topProperties.length - 2}
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
      {isMobile ? (
        <SubscribeSection />
      ) : (
        <div className="container">
          <SubscribeSection />
        </div>
      )}
    </>
  );
};

export default Rental_Resale;
