import React, { useState, useEffect } from "react";
import Link from "next/link";
import SearchSection from "../SearchSection/SearchSection";
import Image from "next/image";
import styles from "./Offplan.module.css";
import { Montserrat } from "next/font/google";
import { StarIcon } from "../icons/PropertyIcons";
import { useRouter } from "next/router";
import axios from "axios";
import { OFFPLAN_APi } from "@/routes/apiRoutes";
import defaultImage from "../../assets/img/default.webp"; // ✅ Correct import
import { LoadingWrapper } from "../LoadingWrapper/index"; // Import LoadingWrapper

// Configure Montserrat
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat"
});

const Offplan = ({ initialData, initialPagination }) => {
  const [cardData, setCardData] = useState(initialData || []);
  const [currentPage, setCurrentPage] = useState(initialPagination?.current_page || 1);
  const [totalPages, setTotalPages] = useState(initialPagination?.last_page || 1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleReadMore = (slug) => {
    router.push(`/offplan/${slug}`);
  };

  const fetchData = async (page) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${OFFPLAN_APi}?page=${page}`);
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

  // Handle page change
  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      fetchData(page); // Fetch data for the new page
    }
  };

  // Fetch data when the component mounts (if no initialData is provided)
  useEffect(() => {
    if (!initialData) {
      fetchData(currentPage);
    }
  }, [currentPage, initialData]);

  const decodeImageUrl = (url) => {
    return decodeURIComponent(url);
  };

  return (
    <div className={`container ${styles.container} ${montserrat.className}`}>
      <div className={styles.listSection}>
        <SearchSection />
        <div className={styles.resultsHeader}>
          <h2 className={styles.title}>New Developments for sale in Dubai</h2>
        </div>

        <LoadingWrapper isLoading={isLoading}>
          <div className={styles.propertyGrid}>
            {cardData.map((property) => (
              <div
                key={property.id}
                className={styles.propertyCardLink}
                onClick={() => handleReadMore(property.slug)} // Trigger handleReadMore
                style={{ cursor: "pointer" }} // Add pointer cursor for better UX
              >
                <div className={styles.propertyCard}>
                  <div className={styles.imageContainer}>
                    <Image
                      src={
                        property.main_photo
                          ? `${
                              process.env.NEXT_PUBLIC_API_URL
                            }/storage/${decodeImageUrl(property.main_photo)}`
                          : defaultImage // ✅ Use it directly as a string
                      }
                      alt={property.title || "Default Property Image"} // ✅ Ensure alt text is always present
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={styles.propertyImage}
                      priority
                      unoptimized
                    />
                    {property.exclusive && (
                      <span className={styles.exclusive}>Exclusive</span>
                    )}
                  </div>

                  <div className={styles.propertyInfo}>
                    <h3 className={styles.title}>{property.title}</h3>
                    <p className={styles.location}>{property.subtitle}</p>

                    <div className={styles.features}>
                      <div className={styles.feature}>
                        <Image
                          src={require("/assets/img/badicon.png")}
                          alt="Bed Icon"
                          width={24}
                          height={24}
                        />
                        <span>{property.bedroom} Br</span>
                      </div>
                      <div className={styles.feature}>
                        <Image
                          src={require("/assets/img/bathicon.png")}
                          alt="Bath Icon"
                          width={24}
                          height={24}
                        />
                        <span>{property.bathroom} Ba</span>
                      </div>
                      <div className={styles.feature}>
                        <Image
                          src={require("/assets/img/areavector.png")}
                          alt="Area Icon"
                          width={24}
                          height={24}
                        />
                        <span>{property.sq_ft} Sq.Ft</span>
                      </div>
                      <div className={styles.feature}>
                        <Image
                          src={require("/assets/img/warehousevector.png")}
                          alt="Car Icon"
                          width={24}
                          height={24}
                        />
                        <span>{property.garage} Gr</span>
                      </div>
                    </div>

                    <div className={styles.priceRow}>
                      <span className={styles.price}>
                        USD {property.amount.toLocaleString()}
                      </span>
                      <span className={styles.price}>
                        AED {property.amount_dirhams.toLocaleString()}
                      </span>
                      <div className={styles.actions}>
                        <button className={styles.actionButton}>
                          <StarIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </LoadingWrapper>

        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`${styles.pageButton} ${
                currentPage === page ? styles.active : ""
              }`}
              disabled={isLoading}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className={styles.pageButton}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Offplan;