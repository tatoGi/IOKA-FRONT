import React, { useState, useEffect, useRef } from "react";
import stylesearch from "./styles.module.css"; // Should be correct path
import offplanStyles from "../Offplan/Offplan.module.css";
import defaultImage from "../../assets/img/default.webp";
import Image from "next/image";
import { BsWhatsapp } from "react-icons/bs";
import callVector from "../../assets/img/call.svg";
import agentifno from "../../assets/img/agentinfo.png";
import stylesdeveloper from "../Developer/Developer.module.css";
import stylesrental from "../Rental_Resale/RentalList.module.css";
import searchResultimg from "../../assets/img/search_svgrepo.com.png";
import { HiOutlineMail } from "react-icons/hi";
import homeIcon from "../../assets/img/resale_home.svg";
import {
  FaChevronLeft,  
  FaChevronRight,
  FaPhone,
  FaWhatsapp,
  FaSearch
} from "react-icons/fa";
import axios from "axios";
import { PROPERTIES_API } from "@/routes/apiRoutes";
import { useRouter } from "next/router";

const SearchHomeResult = ({ searchParams }) => {
  const slideRef = useRef(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [developers, setDevelopers] = useState([]);
  const [rentalData, setRentalData] = useState([]);
  const [resaleData, setResaleData] = useState([]);
  const [totals, setTotals] = useState({ developers: 0, offplan: 0, rental: 0, resale: 0 });
   const [currentImageIndex, setCurrentImageIndex] = useState(0);
   const [touchStart, setTouchStart] = useState(0);
   const [touchEnd, setTouchEnd] = useState(0);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [developerImageIndexes, setDeveloperImageIndexes] = useState({});

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getImageUrl = (photo, developerId) => {
    const currentIndex = developerImageIndexes[developerId] || 0;
    if (!photo) {
      return { url: defaultImage, alt: "Default Developer Image" };
    }

    let parsedPhoto;
    try {
      parsedPhoto = typeof photo === 'string' ? JSON.parse(photo) : photo;
    } catch (e) {
      console.error('Error parsing developer photo:', e);
      return { url: defaultImage, alt: "Default Developer Image" };
    }

    if (Array.isArray(parsedPhoto) && parsedPhoto.length > 0) {
      const imageFile = parsedPhoto[currentIndex]?.file;
      if (imageFile) {
        return {
          url: `${process.env.NEXT_PUBLIC_API_URL}/storage/${imageFile}`,
          alt: `Developer Image ${currentIndex + 1}`
        };
      }
    }
    return { url: defaultImage, alt: "Default Developer Image" };
  };

  const handlePrevImage = (developerId, photos) => {
    let parsedPhotos;
    try {
        parsedPhotos = typeof photos === 'string' ? JSON.parse(photos) : photos;
    } catch (e) {
        return;
    }

    setDeveloperImageIndexes(prev => ({
        ...prev,
        [developerId]: (prev[developerId] || 0) === 0 ? parsedPhotos.length - 1 : (prev[developerId] || 0) - 1
    }));
  };

  const handleNextImage = (developerId, photos) => {
      let parsedPhotos;
      try {
          parsedPhotos = typeof photos === 'string' ? JSON.parse(photos) : photos;
      } catch (e) {
          return;
      }
      
      setDeveloperImageIndexes(prev => ({
          ...prev,
          [developerId]: ((prev[developerId] || 0) + 1) % parsedPhotos.length
      }));
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleReadMore = (slug, type) => {
    switch (type) {
      case "offplan":
        router.push(`/offplan/${slug}`);
        break;
      case "rental":
        router.push(`/rental/${slug}`);
        break;
      case "resale":
        router.push(`/rental/${slug}`);
        break;
      default:
        console.error("Invalid property type");
    }
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

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // If it's an empty search, don't make the API call
        if (searchParams.empty) {
          setProperties([]);
          setDevelopers([]);
          setRentalData([]);
          setResaleData([]);
          setLoading(false);
          return;
        }

        // Convert searchParams to query string
        // Log the search parameters being sent
        console.log('Search Parameters:', searchParams);
        
        const queryString = new URLSearchParams({...searchParams, limit: 100}).toString();
        console.log('Query String:', queryString);

        try {
          const response = await axios.get(`${PROPERTIES_API}?${queryString}`);
          console.log(response);
          
          if (!response.data) {
            throw new Error('No data received from server');
          }
          
          // Get all available property types
          const offplanData = response.data?.data?.OFFPLAN || [];
          const rentalData = response.data?.data?.RENTAL || [];
          const resaleData = response.data?.data?.RESALE || [];
          setRentalData(rentalData);
          setResaleData(resaleData);
          const developersData = response.data?.data?.developers || [];

          // Set totals from meta, with fallback to length
          setTotals({
            developers: response.data?.meta?.total_developers ?? developersData.length,
            offplan: response.data?.meta?.total_offplan ?? offplanData.length,
            rental: response.data?.meta?.total_rental ?? rentalData.length,
            resale: response.data?.meta?.total_resale ?? resaleData.length,
          });

          // Set developers state
          setDevelopers(developersData);

          // Create a map of developer IDs to developer data for quick lookup
          const developerMap = developersData.reduce((acc, developer) => {
            acc[developer.id] = developer;
            return acc;
          }, {});

          // Combine all properties into a single array with type information and developer data
          const allProperties = [
            ...(Array.isArray(offplanData)
              ? offplanData.map((prop) => ({
                  ...prop,
                  type: "offplan",
                  developer: prop.developer_id
                    ? developerMap[prop.developer_id]
                    : null
                }))
              : []),
            ...(Array.isArray(rentalData)
              ? rentalData.map((prop) => ({
                  ...prop,
                  type: "rental",
                  developer: prop.developer_id
                    ? developerMap[prop.developer_id]
                    : null
                }))
              : []),
            ...(Array.isArray(resaleData)
              ? resaleData.map((prop) => ({
                  ...prop,
                  type: "resale",
                  developer: prop.developer_id
                    ? developerMap[prop.developer_id]
                    : null
                }))
              : [])
          ];

          setProperties(allProperties);
        } catch (error) {
          console.error('API Error:', error.response?.data || error.message);
          throw error;
        }
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to fetch properties");
        setProperties([]);
        setDevelopers([]);
        setRentalData([]);
        setResaleData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchParams]);
  const decodeImageUrl = (url) => {
    return decodeURIComponent(url);
  };

  if (loading) {
    return <div className={stylesearch.loading}>Loading...</div>;
  }

  if (error) {
    return (
      <div className={stylesearch.noResults}>
        <div className={stylesearch.noResultsContent}>
          <div className={stylesearch.searchIcon}>
            <Image 
              src={searchResultimg}
              alt="No results"
              width={120}
              height={120}
            />
          </div>
          <h2>No results found</h2>
          <p>Sorry, we couldn't find any results for this search.</p>
          <span>Please try searching with another term</span>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className={stylesearch.noResults}>
        <div className={stylesearch.noResultsContent}>
          <div className={stylesearch.searchIcon}>
            <Image 
              src={require("/assets/img/no-results.svg")}
              alt="No results"
              width={120}
              height={120}
            />
          </div>
          <h2>No results found</h2>
          <p>Sorry, we couldn't find any results for this search.</p>
          <p>Please try searching with another term</p>
        </div>
      </div>
    );
  }
  return (
    <section className={stylesearch.searchhome}>
      <div className="container">
        <h1>{totals.offplan + totals.rental + totals.resale + totals.developers} Results</h1>

        {properties.length > 0 && (
          <>
            {properties.some((p) => p.type === "offplan") && (
              <section className={stylesearch.offplan_section}>
                <div className={stylesearch.header}>
                  <div className={stylesearch.result}>
                    <span className={stylesearch.result_text}>Offplan</span>
                    <span className={stylesearch.count}>({totals.offplan})</span>
                  </div>
                </div>
                <div className={offplanStyles.cardContainer}>
            {properties
              .filter((p) => p.type === "offplan")
              .map((property) => (
                <div
                  key={property?.id || Math.random()}
                  className={offplanStyles.propertyCardLink}
                  onClick={() =>
                    property?.slug && handleReadMore(property.slug, "offplan")
                  }
                  style={{ cursor: "pointer" }}
                >
                  <div className={offplanStyles.propertyCard}>
                    <div className={offplanStyles.imageContainer}>
                      <Image
                        src={
                          property?.main_photo
                            ? `${
                                process.env.NEXT_PUBLIC_API_URL
                              }/storage/${decodeImageUrl(property.main_photo)}`
                            : defaultImage
                        }
                        alt={
                          property?.alt_texts?.main_photo ||
                          property?.title ||
                          "Default Property Image"
                        }
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={offplanStyles.propertyImage}
                        priority
                        unoptimized
                      />
                      {property?.exclusive && (
                        <span className={offplanStyles.exclusive}>Exclusive</span>
                      )}
                    </div>

                    <div className={offplanStyles.propertyInfo}>
                      <h3
                        className={`${offplanStyles.property_title} ${offplanStyles.textEllipsis}`}
                      >
                        {property?.title || "Untitled Property"}
                      </h3>
                      <p
                        className={`${offplanStyles.location} ${offplanStyles.textEllipsis}`}
                      >
                        {property?.map_location || "Location not specified"}
                      </p>

                      <div className={offplanStyles.features}>
                        <div
                          className={`${offplanStyles.feature} ${offplanStyles.textEllipsis}`}
                        >
                          <Image
                            src={require("/assets/img/bad.svg")}
                            alt="Bed Icon"
                            width={24}
                            height={24}
                          />
                          <span>
                            {property?.bedroom === 0 ||
                            property?.bedroom === "0"
                              ? "Studio"
                              : property?.bedroom || 0}{" "}
                            Br
                          </span>
                        </div>
                        <div
                          className={`${offplanStyles.feature} ${offplanStyles.textEllipsis}`}
                        >
                          <Image
                            src={require("/assets/img/bath.svg")}
                            alt="Bath Icon"
                            width={24}
                            height={24}
                          />
                          <span>
                            {property?.bathroom === 0 ||
                            property?.bathroom === "0"
                              ? "Studio"
                              : property?.bathroom || 0}{" "}
                            Ba
                          </span>
                        </div>
                        <div
                          className={`${offplanStyles.feature} ${offplanStyles.textEllipsis}`}
                        >
                          <Image
                            src={require("/assets/img/place.svg")}
                            alt="Area Icon"
                            width={24}
                            height={24}
                          />
                          <span>{property?.sq_ft || 0} Sq.m</span>
                        </div>
                        <div
                          className={`${offplanStyles.feature} ${offplanStyles.textEllipsis}`}
                        >
                          <Image
                            src={require("/assets/img/garage.svg")}
                            alt="Area Icon"
                            width={24}
                            height={24}
                          />
                          <span>{property?.garage || 0} Gr</span>
                        </div>
                      </div>
                      <div className={offplanStyles.priceRow}>
                        <span
                          className={`${offplanStyles.price} ${offplanStyles.textEllipsis}`}
                        >
                          USD {property?.amount?.toLocaleString() || "0"}
                        </span>
                        <span
                          className={`${offplanStyles.price} ${offplanStyles.textEllipsis}`}
                        >
                          AED{" "}
                          {property?.amount_dirhams?.toLocaleString() || "0"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
              </section>
            )}

            {properties.some((p) => p.type === "rental") && (
              <section className={stylesearch.rental_section}>
                <div className={stylesearch.header}>
                  <div className={stylesearch.result}>
                    <span className={stylesearch.result_text}>Rental</span>
                    <span className={stylesearch.count}>({totals.rental})</span>
                  </div>
                </div>
                <div className={stylesrental.resaleList}>
              { rentalData.map((listing) => {
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
                    className={stylesrental.resaleCard}
                    onClick={() => {
                      handleReadMore(listing.slug);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <div className={stylesrental.largeImage}>
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
                            <div className={stylesrental.resaleButton} style={{ position: 'relative', zIndex: 1 }}>
                              <div className={stylesrental.iconGroup}>
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
                            <div className={stylesrental.rentalButton} style={{ position: 'relative', zIndex: 1 }}>
                              <div className={stylesrental.iconGroup}>
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
                        <div className={stylesrental.resaleButton}>
                          <div className={stylesrental.iconGroup}>
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
                      <div className={stylesrental.smallImagesGrid}>
                        {galleryImages.slice(1, 3).map((image, index) => (
                          <div key={index} className={stylesrental.smallImage}>
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
                    <div className={stylesrental.mobileImageSlider}>
                      <button
                        className={`${stylesrental.sliderArrow} ${stylesrental.prevArrow}`}
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
                        className={stylesrental.slideContainer}
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
                          <div key={index} className={stylesrental.slide}>
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
                        className={`${stylesrental.sliderArrow} ${stylesrental.nextArrow}`}
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
                      <div className={stylesrental.slideIndicators}>
                        {galleryImages.map((_, index) => (
                          <div
                            key={index}
                            className={`${stylesrental.indicator} ${index === currentImageIndex ? stylesrental.active : ""
                              }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex(index);
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className={stylesrental.resaleContent}>
                      <h4>{listing.title}</h4>

                      <p className={stylesrental.resaleLocation}>
                        {listing.locations && listing.locations.length > 0
                          ? listing.locations[0].title
                          : listing.subtitle || listing.location || ''}
                      </p>
                      <div className={stylesrental.priceContainer}>
                        {isMobile && (
                          <div className={stylesrental.starting_price}>
                            <span>Starting Price</span>
                          </div>
                        )}
                        <p className={stylesrental.resalePrice}>
                          USD {listing.amount.amount?.toLocaleString() || "N/A"}
                          K
                        </p>
                        <p className={stylesrental.resalePrice}>
                          AED{" "}
                          {listing.amount.amount_dirhams?.toLocaleString() ||
                            "N/A"}
                          K
                        </p>
                      </div>

                      <div className={stylesrental.resaleStats}>
                        <div className={stylesrental.statGroup}>
                          <Image
                            src={require("/assets/img/bad.svg")}
                            alt="Bedrooms"
                            width={16}
                            height={16}
                          />
                          <span>{listing.bedroom} Br</span>
                        </div>
                        <div className={stylesrental.statSeparator}>|</div>
                        <div className={stylesrental.statGroup}>
                          <Image
                            src={require("/assets/img/bath.svg")}
                            alt="Bathrooms"
                            width={16}
                            height={16}
                          />
                          <span>{listing.bathroom} Ba</span>
                        </div>
                        <div className={stylesrental.statSeparator}>|</div>
                        <div className={stylesrental.statGroup}>
                          <Image
                            src={require("/assets/img/place.svg")}
                            alt="Bathrooms"
                            width={16}
                            height={16}
                          />
                          <span>{listing.sq_ft} Sq.m</span>
                        </div>
                        <div className={stylesrental.statSeparator}>|</div>
                        <div className={stylesrental.statGroup}>
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
                        <div className={stylesrental.description}>
                          <p
                            dangerouslySetInnerHTML={{
                              __html: listing.description
                            }}
                          />
                        </div>
                      )}
                      {!isMobile && (
                        <div className={stylesrental.resaleDetails}>
                          {(Array.isArray(listing.details) ? listing.details.slice(0, 4) : []).map((detail, index) => (
                            <p key={index}>{detail.info}</p>
                          ))}
                        </div>
                      )}
                      {!isMobile && (
                        <div className={stylesrental.resaleFooter}>
                          <div className={stylesrental.agentInfo}>
                            <Image
                              src={listing.agent_image || agentifno}
                              alt="Agent"
                              width={40}
                              height={40}
                              className={stylesrental.agentImage}
                            />
                            <span>{listing.agent_title}</span>
                          </div>
                          <div className={stylesrental.footerActions}>
                            <button className={stylesrental.footerButton}>
                              <BsWhatsapp size={16} color="#34C759" />
                              <span>WhatsApp</span>
                            </button>
                            <div className={stylesrental.footerSeparator}>|</div>
                            <button className={stylesrental.footerButton}>
                              <Image src={callVector} alt="Call" />
                              <span>Call Us</span>
                            </button>
                          </div>
                        </div>
                      )}
                      {isMobile && (
                        <div className={stylesrental.propertyActions}>
                          <button className={stylesrental.actionButton_email}>
                            <HiOutlineMail size={16} color="#1A1A1A" />
                            <span>Email</span>
                          </button>
                          <button className={stylesrental.actionButton_call}>
                            <Image src={callVector} alt="Call" />
                            <span>Call</span>
                          </button>
                          <button className={stylesrental.actionButton_whatsapp}>
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
              </section>
            )}

            {properties.some((p) => p.type === "resale") && (
              <section className={stylesearch.resale_section}>
                <div className={stylesearch.header}>
                  <div className={stylesearch.result}>
                    <span className={stylesearch.result_text}>Resale</span>
                    <span className={stylesearch.count}>({totals.resale})</span>
                  </div>
                </div>
                <div className={stylesearch.resaleList}>
              {resaleData.map((listing) => {
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
                    className={stylesrental.resaleCard}
                    onClick={() => {
                      handleReadMore(listing.slug);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <div className={stylesrental.largeImage}>
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
                            <div className={stylesrental.resaleButton} style={{ position: 'relative', zIndex: 1 }}>
                              <div className={stylesrental.iconGroup}>
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
                            <div className={stylesrental.resaleButton} style={{ position: 'relative', zIndex: 1 }}>
                              <div className={stylesrental.iconGroup}>
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
                        <div className={stylesrental.resaleButton}>
                          <div className={stylesrental.iconGroup}>
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
                      <div className={stylesrental.smallImagesGrid}>
                        {galleryImages.slice(1, 3).map((image, index) => (
                          <div key={index} className={stylesrental.smallImage}>
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
                    <div className={stylesrental.mobileImageSlider}>
                      <button
                        className={`${stylesrental.sliderArrow} ${stylesrental.prevArrow}`}
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
                        className={stylesrental.slideContainer}
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
                          <div key={index} className={stylesrental.slide}>
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
                        className={`${stylesrental.sliderArrow} ${stylesrental.nextArrow}`}
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
                      <div className={stylesrental.slideIndicators}>
                        {galleryImages.map((_, index) => (
                          <div
                            key={index}
                            className={`${stylesrental.indicator} ${index === currentImageIndex ? stylesrental.active : ""
                              }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex(index);
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className={stylesrental.resaleContent}>
                      <h4>{listing.title}</h4>

                      <p className={stylesrental.resaleLocation}>
                        {listing.locations && listing.locations.length > 0
                          ? listing.locations[0].title
                          : listing.subtitle || listing.location || ''}
                      </p>
                      <div className={stylesrental.priceContainer}>
                        {isMobile && (
                          <div className={stylesrental.starting_price}>
                            <span>Starting Price</span>
                          </div>
                        )}
                        <p className={stylesrental.resalePrice}>
                          USD {listing.amount.amount?.toLocaleString() || "N/A"}
                          K
                        </p>
                        <p className={stylesrental.resalePrice}>
                          AED{" "}
                          {listing.amount.amount_dirhams?.toLocaleString() ||
                            "N/A"}
                          K
                        </p>
                      </div>

                      <div className={stylesrental.resaleStats}>
                        <div className={stylesrental.statGroup}>
                          <Image
                            src={require("/assets/img/bad.svg")}
                            alt="Bedrooms"
                            width={16}
                            height={16}
                          />
                          <span>{listing.bedroom} Br</span>
                        </div>
                        <div className={stylesrental.statSeparator}>|</div>
                        <div className={stylesrental.statGroup}>
                          <Image
                            src={require("/assets/img/bath.svg")}
                            alt="Bathrooms"
                            width={16}
                            height={16}
                          />
                          <span>{listing.bathroom} Ba</span>
                        </div>
                        <div className={stylesrental.statSeparator}>|</div>
                        <div className={stylesrental.statGroup}>
                          <Image
                            src={require("/assets/img/place.svg")}
                            alt="Bathrooms"
                            width={16}
                            height={16}
                          />
                          <span>{listing.sq_ft} Sq.m</span>
                        </div>
                        <div className={stylesrental.statSeparator}>|</div>
                        <div className={stylesrental.statGroup}>
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
                        <div className={stylesrental.description}>
                          <p
                            dangerouslySetInnerHTML={{
                              __html: listing.description
                            }}
                          />
                        </div>
                      )}
                      {!isMobile && (
                        <div className={stylesrental.resaleDetails}>
                          {(Array.isArray(listing.details) ? listing.details.slice(0, 4) : []).map((detail, index) => (
                            <p key={index}>{detail.info}</p>
                          ))}
                        </div>
                      )}
                      {!isMobile && (
                        <div className={stylesrental.resaleFooter}>
                          <div className={stylesrental.agentInfo}>
                            <Image
                              src={listing.agent_image || agentifno}  
                              alt="Agent"
                              width={40}
                              height={40}
                              className={stylesrental.agentImage}
                            />
                            <span>{listing.agent_title}</span>
                          </div>
                          <div className={stylesrental.footerActions}>
                            <button className={stylesrental.footerButton}>
                              <BsWhatsapp size={16} color="#34C759" />
                              <span>WhatsApp</span>
                            </button>
                            <div className={stylesrental.footerSeparator}>|</div>
                            <button className={stylesrental.footerButton}>
                              <Image src={callVector} alt="Call" />
                              <span>Call Us</span>
                            </button>
                          </div>
                        </div>
                      )}
                      {isMobile && (
                        <div className={stylesrental.propertyActions}>
                          <button className={stylesrental.actionButton_email}>
                            <HiOutlineMail size={16} color="#1A1A1A" />
                            <span>Email</span>
                          </button>
                          <button className={stylesrental.actionButton_call}>
                            <Image src={callVector} alt="Call" />
                            <span>Call</span>
                          </button>
                          <button className={stylesrental.actionButton_whatsapp}>
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
              </section>
            )}
            <section className={stylesearch.developer_section}>
              <div className={stylesearch.header}>
                <div className={stylesearch.result}>
                  <span className={stylesearch.result_text}>Developer</span>
                  <span className={stylesearch.count}>({totals.developers})</span>
                </div>
                <div className={stylesearch.see_all}>
                  <a href="#" className={stylesearch.see_all_link} title="View all developers">
                    See All
                  </a>
                </div>
              </div>
              <div className={stylesdeveloper.cardsContainer}>
                {developers.map((developer) => (
                  <div
                    key={developer.id}
                    className={stylesdeveloper.cardWrapper}
                  >
                   <div key={developer.id} className={stylesdeveloper.cardWrapper}>
                <div className={stylesdeveloper.card}>
                  <div className={stylesdeveloper.cardRow}>
                    {/* Image Section */}
                    <div className={stylesdeveloper.imageContainer}>
                      {isMobile && (
                        <div className={stylesdeveloper.mobileTitleOverlay}>
                          <h2 className={stylesdeveloper.mobileTitle}>{developer.title}</h2>
                        </div>
                      )}
                      <Image
                        src={getImageUrl(developer.photo, developer.id).url}
                        alt={getImageUrl(developer.photo, developer.id).alt}
                        width={400}
                        height={300}
                        className={stylesdeveloper.cardImage}
                        style={{ objectFit: "cover" }}
                      />
                      {Array.isArray(developer.photo) && developer.photo.length > 1 && (
                        <div className={stylesdeveloper.imageNav}>
                          <button
                            onClick={() =>
                              handlePrevImage(developer.id, developer.photo)
                            }
                            className={stylesdeveloper.prevButtonimage}
                          >
                            <FaChevronLeft />
                          </button>
                          <button
                            onClick={() =>
                              handleNextImage(developer.id, developer.photo)
                            }
                            className={stylesdeveloper.nextButtonimage}
                          >
                            <FaChevronRight />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className={stylesdeveloper.cardContent}>
                      <h2 className={stylesdeveloper.title}>{developer.title}</h2>
                      <div className={stylesdeveloper.description}>
                        <div
                          dangerouslySetInnerHTML={{ __html: developer.paragraph }}
                        />
                      </div>
                      <div className={stylesdeveloper.communitiesSection}>
                        <h3 className={stylesdeveloper.communitiesTitle}>
                          Top Communities
                        </h3>
                        <div className={stylesdeveloper.communitiesList}>
                          {Array.isArray(developer.tags)
                            ? developer.tags.map((tag, index) => (
                                <span key={index} className={stylesdeveloper.badge}>
                                  {tag}
                                </span>
                              ))
                            : JSON.parse(developer.tags || "[]").map(
                                (tag, index) => (
                                  <span key={index} className={stylesdeveloper.badge}>
                                    {tag}
                                  </span>
                                )
                              )}
                        </div>
                      </div>

                      {/* Buttons Section */}
                      <div className={stylesdeveloper.buttonsSection}>
                        {/* Left Side: Call and WhatsApp Buttons */}
                        <div className={stylesdeveloper.contactButtons}>
                          <button
                            className={stylesdeveloper.call}
                            onClick={() =>
                              (window.location.href = `tel:${developer.phone}`)
                            }
                          >
                            <FaPhone />
                            <span>Call</span>
                          </button>
                          <button
                            className={stylesdeveloper.whatsapp}
                            onClick={() =>
                              window.open(
                                `https://wa.me/${developer.whatsapp}`,
                                "_blank"
                              )
                            }
                          >
                            <FaWhatsapp />
                            <span>WhatsApp</span>
                          </button>
                        </div>

                        {/* Right Side: See More Button */}
                        <button
                          className={stylesdeveloper.readMore}
                          onClick={() => handleReadMore(developer.slug)}
                        >
                          See More
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </section>
  );
};

export default SearchHomeResult;
