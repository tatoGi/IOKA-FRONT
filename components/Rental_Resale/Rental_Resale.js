import React, { useState, useEffect, useRef } from "react";
import Styles from "./RentalList.module.css";
import Image from "next/image";
import defaultImage from "../../assets/img/default.webp";
import { StarIcon } from "../icons/PropertyIcons";
import SearchSection from "../SearchSection/SearchSection";
import { BsWhatsapp } from "react-icons/bs";
import callVector from "../../assets/img/call.svg";
import agentifno from "../../assets/img/agentinfo.png";
import { useRouter } from "next/router";
import { RENTAL_RESALE } from "@/routes/apiRoutes";
import axios from "axios";
import SubscribeSection from "../SubscribeSection/SubscribeSection";

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

  useEffect(() => {
    setIsClient(true); // Ensures this runs only on the client
  }, []);

  const fetchData = async (page) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${RENTAL_RESALE}?page=${page}`);
      const data = response.data.data;
      setCardData(Array.isArray(data) ? data : [data]);
      setCurrentPage(response.data.current_page);
      setTotalPages(response.data.last_page);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

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

  return (
    <div className="container mt-3">
      {/* Sidebar elements moved out of the row */}
      <div className={Styles.sidebarWrapper}>
        <div className={Styles.sidebarqr}> {/* Sidebar QR code */}</div>
        <div className={Styles.sharediv}> {/* Share div */}</div>
        <div className={Styles.sidebarlocation}> {/* Sidebar location */}</div>
      </div>

      <div className="row">
        {topProperties.length > 0 && (
          <div className={Styles.title_top}>
            <span>Top Listings</span>
          </div>
        )}

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
                    <p className={Styles.location}>{property.location_link}</p>

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
                        USD {property.amount.amount?.toLocaleString() || "N/A"}
                      </span>
                      <span className={Styles.price}>
                        AED{" "}
                        {property.amount.amount_dirhams?.toLocaleString() ||
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

        {/* <SearchSection /> */}

        <div className={Styles.resaleSection}>
          <div className={Styles.resaleHeader}>
            {/* <div className={Styles.resaleTitle}>
              <h3>Search Results</h3>
              <div className={Styles.sortDropdown}>
                <label htmlFor="sort">Sort:</label>
                <select id="sort" name="sort" onChange={(e) => handleSortChange(e.target.value)}>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div> */}
          </div>

          <div className={Styles.resaleList}>
            {cardData.map((listing) => {
              const galleryImages = JSON.parse(listing.gallery_images || "[]");

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
                      onClick={() =>
                        setCurrentImageIndex((prev) => Math.max(prev - 1, 0))
                      }
                      disabled={currentImageIndex === 0}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev + 1 < galleryImages.length ? prev + 1 : prev
                        )
                      }
                      disabled={currentImageIndex === galleryImages.length - 1}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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

                    <p className={Styles.resaleLocation}>{listing.location}</p>
                    <div className="d-flex">
                      <p className={Styles.resalePrice}>
                        AED{" "}
                        {listing.amount.amount_dirhams?.toLocaleString() ||
                          "N/A"}
                      </p>
                      <p className={Styles.resalePrice}>
                        USD {listing.amount.amount?.toLocaleString() || "N/A"}
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

                    <div className={Styles.resaleDetails}>
                      {listing.details.map((detail, index) => (
                        <p key={index}>{detail.info}</p>
                      ))}
                    </div>
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
                  </div>
                </div>
              );
            })}
          </div>

          <div className={Styles.pagination}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              className={Styles.pageButton}
            >
              Next
            </button>
          </div>
          <SubscribeSection />
        </div>
      </div>
    </div>
  );
};

export default Rental_Resale;
