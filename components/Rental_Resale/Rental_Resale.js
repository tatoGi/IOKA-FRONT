import React, { useState, useEffect } from "react";
import Styles from "./RentalList.module.css";
import Image from "next/image";
import defaultImage from "../../assets/img/default.webp";
import { StarIcon } from "../icons/PropertyIcons";
import SearchSection from "../SearchSection/SearchSection";
import { BsWhatsapp } from "react-icons/bs";
import callVector from "../../assets/img/callvector.png";
import agentifno from "../../assets/img/agentinfo.png";
import { useRouter } from "next/router";
import { RENTAL_RESALE } from "@/routes/apiRoutes";
import axios from "axios";

const Rental_Resale = () => {
  const [cardData, setCardData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Fetch data function
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

  // Fetch data on component mount
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  // Handle "Read More" click
  const handleReadMore = (slug) => {
    router.push(`/rental_resale/${slug}`);
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mt-3">
      <div className={Styles.title_top}><span>Top Listings</span></div>

      {/* Display Top Properties */}
      <div className={Styles.propertyGrid}>
        {cardData
          .filter((property) => property.top === 1) // Filter top properties
          .map((property) => (
            <div
              key={property.id}
              className={Styles.propertyCardLink}
              onClick={() => handleReadMore(property.slug)}
              style={{ cursor: "pointer" }}
            >
              <div className={Styles.propertyCard}>
                <div className={Styles.imageContainer}>
                  <Image
                    src={property.main_photo || defaultImage}
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
                  <p className={Styles.location}>{property.subtitle}</p>

                  <div className={Styles.features}>
                    <div className={Styles.feature}>
                      <Image
                        src={require("/assets/img/badicon.png")}
                        alt="Bed Icon"
                        width={24}
                        height={24}
                      />
                      <span>{property.bedroom} Br</span>
                    </div>
                    <div className={Styles.feature}>
                      <Image
                        src={require("/assets/img/bathicon.png")}
                        alt="Bath Icon"
                        width={24}
                        height={24}
                      />
                      <span>{property.bathroom} Ba</span>
                    </div>
                    <div className={Styles.feature}>
                      <Image
                        src={require("/assets/img/areavector.png")}
                        alt="Area Icon"
                        width={24}
                        height={24}
                      />
                      <span>{property.sq_ft} Sq.Ft</span>
                    </div>
                    <div className={Styles.feature}>
                      <Image
                        src={require("/assets/img/warehousevector.png")}
                        alt="Car Icon"
                        width={24}
                        height={24}
                      />
                      <span>{property.garage} Gr</span>
                    </div>
                  </div>

                  <div className={Styles.priceRow}>
                    {/* Fallback to 0 if amount_dirhams or amount is undefined */}
                    <span className={Styles.price}>
                      AED {property.amount.amount_dirhams?.toLocaleString() || "N/A"}
                    </span>
                    <span className={Styles.price}>
                      USD {property.amount.amount?.toLocaleString() || "N/A"}
                    </span>
                    <div className={Styles.actions}>
                      <button className={Styles.actionButton}>
                        <StarIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      <SearchSection />

      {/* Display Resale Listings */}
      <div className={Styles.resaleSection}>
        <div className={Styles.resaleHeader}>
          <div className={Styles.resaleTitle}>
            <h3>Resale</h3>
            <span className={Styles.listingCount}>Listings</span>
          </div>
        </div>

        <div className={Styles.resaleSlider}>
          <div className={Styles.resaleCards}>
            {cardData.map((listing) => (
              <div key={listing.id} className={Styles.resaleCard}>
                <div className={Styles.resaleImage}>
                  <Image
                    src={listing.main_photo || defaultImage}
                    alt={listing.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className={Styles.resaleContent}>
                  <h4>{listing.title}</h4>
                  <p className={Styles.resaleLocation}>{listing.subtitle}</p>
                  <p className={Styles.resalePrice}>
                    AED {listing.amount_dirhams?.toLocaleString() || "N/A"}
                  </p>
                  <div className={Styles.resaleStats}>
                    <div className={Styles.statGroup}>
                      <Image
                        src={require("/assets/img/badicon.png")}
                        alt="Bedrooms"
                        width={16}
                        height={16}
                      />
                      <span>{listing.bedroom} Br</span>
                    </div>
                    <div className={Styles.statSeparator}>|</div>
                    <div className={Styles.statGroup}>
                      <Image
                        src={require("/assets/img/bathicon.png")}
                        alt="Bathrooms"
                        width={16}
                        height={16}
                      />
                      <span>{listing.bathroom} Ba</span>
                    </div>
                    <div className={Styles.statSeparator}>|</div>
                    <div className={Styles.statGroup}>
                      <Image
                        src={require("/assets/img/areavector.png")}
                        alt="Area"
                        width={16}
                        height={16}
                      />
                      <span>{listing.sq_ft} Sq.Ft</span>
                    </div>
                  </div>
                  <div className={Styles.resaleDetails}>
                    <p>{listing.description}</p>
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
            ))}
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
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
    </div>
  );
};

export default Rental_Resale;