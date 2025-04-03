import React, { useState, useEffect } from "react";
import SearchSection from "../SearchSection/SearchSection";
import Image from "next/image";
import styles from "./Offplan.module.css";
import { Montserrat } from "next/font/google";
import { StarIcon } from "../icons/PropertyIcons";
import { useRouter } from "next/router";
import axios from "axios";
import { OFFPLAN_APi, FILTER_OFFPLAN_API } from "@/routes/apiRoutes";
import defaultImage from "../../assets/img/default.webp";
import { LoadingWrapper } from "../LoadingWrapper/index";
import { Container, Row, Col } from "react-bootstrap"; // Import Bootstrap components

// Configure Montserrat
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
});

const Offplan = ({ initialData, initialPagination }) => {
  const [cardData, setCardData] = useState(initialData || []);
  const [currentPage, setCurrentPage] = useState(
    initialPagination?.current_page || 1
  );
  const [totalPages, setTotalPages] = useState(
    initialPagination?.last_page || 1
  );
  const [isLoading, setIsLoading] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    propertyTypes: [],
    priceRanges: [],
    bedrooms: [],
    listedAs: [],
  });
  const router = useRouter();

  const handleReadMore = (slug) => {
    router.push(`/offplan/${slug}`);
  };

  const handleFilterChange = (filters) => {
    fetchData(1, filters); // Fetch filtered data starting from page 1
  };

  const fetchData = async (page, filters = {}) => {
    setIsLoading(true);
    try {
      const apiUrl = Object.keys(filters).length > 0 ? FILTER_OFFPLAN_API : OFFPLAN_APi; // Use FILTER_OFFPLAN_API if filters are applied
      const queryParams = new URLSearchParams({ page, ...filters }).toString();
      const response = await axios.get(`${apiUrl}?${queryParams}`);
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

  const fetchFilterOptions = async () => {
    try {
      const response = await axios.get(OFFPLAN_APi); // Fetch filter options
      const options = response.data;

      // Extract fields for SearchSection filters
      const propertyTypes = [...new Set(options.data.map((item) => item.property_type))];
      const priceRanges = ["0-100000", "100001-500000", "500001-1000000", "1000001-5000000"]; // Example ranges
      const bedrooms = [...new Set(options.data.map((item) => item.bedroom))];
      const listedAs = ["Available", "Sold", "Reserved"]; // Example statuses

      setFilterOptions({
        propertyTypes,
        priceRanges,
        bedrooms,
        listedAs,
      });
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, page }, // Update the page query parameter
        },
        undefined,
        { shallow: true } // Prevent full page reload
      );
      fetchData(page); // Fetch data for the new page
    }
  };

  // Fetch data when the component mounts (if no initialData is provided)
  useEffect(() => {
    if (!initialData.length && !isLoading) {
      fetchData(currentPage);
    }
  }, []);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const decodeImageUrl = (url) => {
    return decodeURIComponent(url);
  };

  return (
    <Container className={`${styles.container} ${montserrat.className}`}>
      <div className={styles.listSection}>
        <SearchSection
          onFilterChange={handleFilterChange}
          filterOptions={filterOptions} // Pass filter options to SearchSection
        />
        <div className={styles.resultsHeader}>
          <h2 className={styles.title}>New Developments for sale in Dubai</h2>
          <span className={styles.resultsCount}>{cardData.length} results</span>
        </div>

        <LoadingWrapper isLoading={isLoading}>
          <div className={styles.cardContainer}>
            {cardData.map((property) => (
              <div
                key={property.id} // Add a unique key prop (assuming `id` is unique for each property)
                className={styles.propertyCardLink}
                onClick={() => handleReadMore(property.slug)}
                style={{ cursor: "pointer" }}
              >
                <div className={styles.propertyCard}>
                  <div className={styles.imageContainer}>
                    <Image
                      src={
                        property.main_photo
                          ? `${
                              process.env.NEXT_PUBLIC_API_URL
                            }/storage/${decodeImageUrl(property.main_photo)}`
                          : defaultImage
                      }
                      alt={property.title || "Default Property Image"}
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
                    <h3 className={`${styles.title} ${styles.textEllipsis}`}>
                      {property.title}
                    </h3>
                    <p className={`${styles.location} ${styles.textEllipsis}`}>
                      {property.map_location}
                    </p>

                    <div className={styles.features}>
                      <div
                        className={`${styles.feature} ${styles.textEllipsis}`}
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
                        className={`${styles.feature} ${styles.textEllipsis}`}
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
                        className={`${styles.feature} ${styles.textEllipsis}`}
                      >
                        <Image
                          src={require("/assets/img/place.svg")}
                          alt="Area Icon"
                          width={24}
                          height={24}
                        />
                        <span>{property.sq_ft} Sq.Ft</span>
                      </div>
                      <div
                        className={`${styles.feature} ${styles.textEllipsis}`}
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
                    <div className={styles.priceRow}>
                      <span
                        className={`${styles.price} ${styles.textEllipsis}`}
                      >
                        USD {property.amount.toLocaleString()}
                      </span>
                      <span
                        className={`${styles.price} ${styles.textEllipsis}`}
                      >
                        AED {property.amount_dirhams.toLocaleString()}
                      </span>
                      {/* <div className={styles.actions}>
                       <button className={styles.actionButton}>
                         <StarIcon />
                       </button>
                     </div> */}
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
    </Container>
  );
};

export default Offplan;