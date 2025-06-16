import React, { useState, useEffect } from "react";
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
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [developers, setDevelopers] = useState([]);
  const router = useRouter();

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

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // If it's an empty search, don't make the API call
        if (searchParams.empty) {
          setProperties([]);
          setDevelopers([]);
          setLoading(false);
          return;
        }

        // Convert searchParams to query string
        // Log the search parameters being sent
        console.log('Search Parameters:', searchParams);
        
        const queryString = new URLSearchParams(searchParams).toString();
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
          const developersData = response.data?.data?.developers || [];

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
        <h1>{properties.length} Results</h1>

        {properties.length > 0 && (
          <>
            {properties.some((p) => p.type === "offplan") && (
              <section className={stylesearch.offplan_section}>
                <div className={stylesearch.header}>
                  <div className={stylesearch.result}>
                    <span className={stylesearch.result_text}>Offplan</span>
                    <span className={stylesearch.count}>
                      ({properties.filter((p) => p.type === "offplan").length})
                    </span>
                  </div>
                </div>
                <div className={offplanStyles.cardContainer}>
                  {properties
                    .filter((p) => p.type === "offplan")
                    .map((property) => (
                      <div
                        key={property.id}
                        className={offplanStyles.propertyCardLink}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleReadMore(property.slug, "offplan")}
                      >
                        <div className={offplanStyles.propertyCard}>
                          <div className={offplanStyles.imageContainer}>
                            <Image
                              src={
                                property.main_photo
                                  ? `${
                                      process.env.NEXT_PUBLIC_API_URL
                                    }/storage/${decodeImageUrl(
                                      property.main_photo
                                    )}`
                                  : defaultImage
                              }
                              alt={property.title || "Property Image"}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className={offplanStyles.propertyImage}
                              priority
                              unoptimized
                            />
                            {property.exclusive && (
                              <span className={offplanStyles.exclusive}>
                                Exclusive
                              </span>
                            )}
                          </div>

                          <div className={offplanStyles.propertyInfo}>
                            <h3
                              className={`${offplanStyles.title} ${offplanStyles.textEllipsis}`}
                            >
                              {property.title}
                            </h3>
                            <p
                              className={`${offplanStyles.location} ${offplanStyles.textEllipsis}`}
                            >
                              {property.location}
                            </p>

                            {property.developer && (
                              <div className={offplanStyles.developerInfo}>
                                <Image
                                  src={
                                    property.developer.logo
                                      ? `${
                                          process.env.NEXT_PUBLIC_API_URL
                                        }/storage/${decodeImageUrl(
                                          property.developer.logo
                                        )}`
                                      : defaultImage
                                  }
                                  alt={
                                    property.developer.title || "Developer Logo"
                                  }
                                  width={24}
                                  height={24}
                                  className={offplanStyles.developerLogo}
                                />
                                <span className={offplanStyles.developerName}>
                                  {property.developer.title}
                                </span>
                              </div>
                            )}

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
                                <span>{property.bedroom} Br</span>
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
                                <span>{property.bathroom} Ba</span>
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
                                <span>{property.sq_ft} Sq.m</span>
                              </div>
                              <div
                                className={`${offplanStyles.feature} ${offplanStyles.textEllipsis}`}
                              >
                                <Image
                                  src={require("/assets/img/garage.svg")}
                                  alt="Car Icon"
                                  width={24}
                                  height={24}
                                />
                                <span>{property.garage} Gr</span>
                              </div>
                            </div>
                            <div className={offplanStyles.priceRow}>
                              <span
                                className={`${offplanStyles.price} ${offplanStyles.textEllipsis}`}
                              >
                                USD {property.amount}
                              </span>
                              <span
                                className={`${offplanStyles.price} ${offplanStyles.textEllipsis}`}
                              >
                                AED {property.amount_dirhams}
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
                    <span className={stylesearch.count}>
                      ({properties.filter((p) => p.type === "rental").length})
                    </span>
                  </div>
                </div>
                <div className={stylesrental.resaleList}>
                  {properties
                    .filter((p) => p.type === "rental")
                    .map((property) => (
                      <div
                        key={property.id}
                        className={stylesrental.resaleCard}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleReadMore(property.slug, "rental")}
                      >
                        <div className={stylesrental.largeImage}>
                          <Image
                            src={defaultImage}
                            alt="Sample Property"
                            style={{ objectFit: "cover" }}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 580px"
                          />
                        </div>

                        <div className={stylesrental.smallImagesGrid}>
                          <div className={stylesrental.smallImage}>
                            <Image
                              src={defaultImage}
                              alt="Gallery Image 1"
                              style={{ objectFit: "cover" }}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 40vw, 334px"
                            />
                          </div>
                          <div className={stylesrental.smallImage}>
                            <Image
                              src={defaultImage}
                              alt="Gallery Image 2"
                              style={{ objectFit: "cover" }}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 40vw, 334px"
                            />
                          </div>
                        </div>

                        {/* Mobile view slider (you can hide/show with media queries if needed) */}
                        <div className={stylesrental.mobileImageSlider}>
                          <button
                            className={`${stylesrental.sliderArrow} ${stylesrental.prevArrow}`}
                            disabled
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
                            style={{ transform: "translateX(0%)" }}
                          >
                            <div className={stylesrental.slide}>
                              <Image
                                src="/your-slide-image.jpg"
                                alt="Property Image 1"
                                fill
                                style={{ objectFit: "cover" }}
                                sizes="100vw"
                                priority
                              />
                            </div>
                          </div>

                          <button
                            className={`${stylesrental.sliderArrow} ${stylesrental.nextArrow}`}
                            disabled
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
                            <div
                              className={`${stylesrental.indicator} ${stylesrental.active}`}
                            />
                            <div className={stylesrental.indicator} />
                            <div className={stylesrental.indicator} />
                          </div>
                        </div>

                        <div className={stylesrental.resaleContent}>
                          <h4>Beautiful Family Villa</h4>
                          <p className={stylesrental.resaleLocation}>
                            Palm Jumeirah, Dubai
                          </p>

                          <div className="d-flex gap-2.5">
                            <div className={stylesrental.starting_price}>
                              <span>Starting Price</span>
                            </div>
                            <p className={stylesrental.resalePrice}>
                              USD 1,200K
                            </p>
                            <p className={stylesrental.resalePrice}>
                              AED 4,500K
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
                              <span>4 Br</span>
                            </div>
                            <div className={stylesrental.statSeparator}>|</div>
                            <div className={stylesrental.statGroup}>
                              <Image
                                src={require("/assets/img/bath.svg")}
                                alt="Bathrooms"
                                width={16}
                                height={16}
                              />
                              <span>3 Ba</span>
                            </div>
                            <div className={stylesrental.statSeparator}>|</div>
                            <div className={stylesrental.statGroup}>
                              <Image
                                src={require("/assets/img/place.svg")}
                                alt="SqFt"
                                width={16}
                                height={16}
                              />
                              <span>3200 Sq.m</span>
                            </div>
                            <div className={stylesrental.statSeparator}>|</div>
                            <div className={stylesrental.statGroup}>
                              <Image
                                src={require("/assets/img/garage.svg")}
                                alt="Garage"
                                width={16}
                                height={16}
                              />
                              <span>2 Gr</span>
                            </div>
                          </div>

                          <div className={stylesrental.resaleDetails}>
                            <p>Spacious living area</p>
                            <p>Private garden and pool</p>
                            <p>Close to the beach</p>
                          </div>

                          <div className={stylesrental.resaleFooter}>
                            <div className={stylesrental.agentInfo}>
                              <Image
                                src={
                                  property.agent_photo
                                    ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${property.agent_photo}`
                                    : agentifno
                                }
                                alt="Agent"
                                width={40}
                                height={40}
                                className={stylesrental.agentImage}
                              />
                              <span>{property.agent_title}</span>
                            </div>
                            <div className={stylesrental.footerActions}>
                              <button className={stylesrental.footerButton}>
                                <BsWhatsapp size={20} color="#34C759" />
                                <span>WhatsApp</span>
                              </button>
                              <div className={stylesrental.footerSeparator}>
                                |
                              </div>
                              <button className={stylesrental.footerButton}>
                                <Image
                                  src={callVector}
                                  alt="Call"
                                  width={16}
                                  height={16}
                                />
                                <span>Call Us</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            )}

            {properties.some((p) => p.type === "resale") && (
              <section className={stylesearch.resale_section}>
                <div className={stylesearch.header}>
                  <div className={stylesearch.result}>
                    <span className={stylesearch.result_text}>Resale</span>
                    <span className={stylesearch.count}>
                      ({properties.filter((p) => p.type === "resale").length})
                    </span>
                  </div>
                </div>
                <div className={stylesrental.resaleList}>
                  {properties
                    .filter((p) => p.type === "resale")
                    .map((property) => {
                      const galleryImages = JSON.parse(
                        property.gallery_images || "[]"
                      );
                      return (
                        <div
                          key={property.id}
                          className={stylesrental.resaleCard}
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            handleReadMore(property.slug, "resale")
                          }
                        >
                          <div className={stylesrental.largeImage}>
                            <Image
                              src={
                                galleryImages[0]
                                  ? `${
                                      process.env.NEXT_PUBLIC_API_URL
                                    }/storage/${decodeImageUrl(
                                      galleryImages[0]
                                    )}`
                                  : defaultImage
                              }
                              alt="Sample Property"
                              style={{ objectFit: "cover" }}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 580px"
                            />
                          </div>

                          <div className={stylesrental.smallImagesGrid}>
                            {galleryImages.slice(1, 3).map((image, index) => (
                              <div
                                key={index}
                                className={stylesrental.smallImage}
                              >
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

                          <div className={stylesrental.resaleContent}>
                            <h4>{property.title}</h4>
                            <p className={stylesrental.resaleLocation}>
                              {property.subtitle}
                            </p>

                            <div className="d-flex gap-2.5">
                              <div className={stylesrental.starting_price}>
                                <span>Starting Price</span>
                              </div>
                              <p className={stylesrental.resalePrice}>
                                USD{" "}
                                {property.amount.amount?.toLocaleString() ||
                                  "N/A"}
                                K
                              </p>
                              <p className={stylesrental.resalePrice}>
                                AED{" "}
                                {property.amount.amount_dirhams?.toLocaleString() ||
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
                                <span>{property.bedroom} Br</span>
                              </div>
                              <div className={stylesrental.statSeparator}>
                                |
                              </div>
                              <div className={stylesrental.statGroup}>
                                <Image
                                  src={require("/assets/img/bath.svg")}
                                  alt="Bathrooms"
                                  width={16}
                                  height={16}
                                />
                                <span>{property.bathroom} Ba</span>
                              </div>
                              <div className={stylesrental.statSeparator}>
                                |
                              </div>
                              <div className={stylesrental.statGroup}>
                                <Image
                                  src={require("/assets/img/place.svg")}
                                  alt="SqFt"
                                  width={16}
                                  height={16}
                                />
                                <span>{property.sq_ft} Sq.m</span>
                              </div>
                              <div className={stylesrental.statSeparator}>
                                |
                              </div>
                              <div className={stylesrental.statGroup}>
                                <Image
                                  src={require("/assets/img/garage.svg")}
                                  alt="Garage"
                                  width={16}
                                  height={16}
                                />
                                <span>{property.garage} Gr</span>
                              </div>
                            </div>

                            <div className={stylesrental.resaleDetails}>
                              {property.details?.map((detail, index) => (
                                <p key={index}>{detail.info}</p>
                              ))}
                            </div>

                            <div className={stylesrental.resaleFooter}>
                              <div className={stylesrental.agentInfo}>
                                <Image
                                  src={
                                    property.agent_photo
                                      ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${property.agent_photo}`
                                      : agentifno
                                  }
                                  alt="Agent"
                                  width={40}
                                  height={40}
                                  className={stylesrental.agentImage}
                                />
                                <span>{property.agent_title}</span>
                              </div>
                              <div className={stylesrental.footerActions}>
                                <button className={stylesrental.footerButton}>
                                  <BsWhatsapp size={20} color="#34C759" />
                                  <span>WhatsApp</span>
                                </button>
                                <div className={stylesrental.footerSeparator}>
                                  |
                                </div>
                                <button className={stylesrental.footerButton}>
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
              </section>
            )}
            <section className={stylesearch.developer_section}>
              <div className={stylesearch.header}>
                <div className={stylesearch.result}>
                  <span className={stylesearch.result_text}>Developer</span>
                  <span className={stylesearch.count}>
                    ({developers.length})
                  </span>
                </div>
                <div className={stylesearch.see_all}>
                  <a href="#" className={stylesearch.see_all_link}>
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
                    <div className={stylesdeveloper.card}>
                      <div className={stylesdeveloper.cardRow}>
                        {/* Image Section */}
                        <div className={stylesdeveloper.imageContainer}>
                          <Image
                            src={
                              developer.photo
                                ? (() => {
                                    try {
                                      const parsedPhoto = JSON.parse(developer.photo);
                                      return parsedPhoto && parsedPhoto[0] && parsedPhoto[0].file
                                        ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${parsedPhoto[0].file}`
                                        : defaultImage;
                                    } catch (e) {
                                      console.error('Error parsing developer photo:', e);
                                      return defaultImage;
                                    }
                                  })()
                                : defaultImage
                            }
                            alt={developer.title || "Developer Image"}
                            width={400}
                            height={300}
                            className={stylesdeveloper.cardImage}
                            style={{ objectFit: "cover" }}
                          />
                          <div className={stylesdeveloper.imageNav}>
                            <button className={stylesdeveloper.prevButtonimage}>
                              <FaChevronLeft />
                            </button>
                            <button className={stylesdeveloper.nextButtonimage}>
                              <FaChevronRight />
                            </button>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className={stylesdeveloper.cardContent}>
                          <h2 className={stylesdeveloper.title}>
                            {developer.title}
                          </h2>
                          <div className={stylesdeveloper.description}>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: developer.paragraph
                              }}
                            />
                          </div>

                          <div className={stylesdeveloper.communitiesSection}>
                            <h3 className={stylesdeveloper.communitiesTitle}>
                              Top Communities
                            </h3>
                            <div className={stylesdeveloper.communitiesList}>
                              {(() => {
                                try {
                                  const tags = JSON.parse(developer.tags);
                                  return Array.isArray(tags) 
                                    ? tags.map((tag, index) => (
                                        <span
                                          key={index}
                                          className={stylesdeveloper.badge}
                                        >
                                          {tag}
                                        </span>
                                      ))
                                    : [developer.tags].map((tag, index) => (
                                        <span
                                          key={index}
                                          className={stylesdeveloper.badge}
                                        >
                                          {tag}
                                        </span>
                                      ));
                                } catch (e) {
                                  console.error('Error parsing developer tags:', e);
                                  // If parsing fails, treat it as a single string
                                  return (
                                    <span className={stylesdeveloper.badge}>
                                      {developer.tags}
                                    </span>
                                  );
                                }
                              })()}
                            </div>
                          </div>

                          {/* Buttons Section */}
                          <div className={stylesdeveloper.buttonsSection}>
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

                            <button
                              className={stylesdeveloper.readMore}
                              onClick={() =>
                                router.push(`/developer/${developer.slug}`)
                              }
                            >
                              See More
                            </button>
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
