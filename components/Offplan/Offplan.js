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
import { Container, Row, Col } from "react-bootstrap"; // Import Bootstrap components
import RangeInputPopup from "../SearchSection/RangeInputPopup";

// Configure Montserrat
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat"
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
  const [showPricePopup, setShowPricePopup] = useState(false);
  const [showSqFtPopup, setShowSqFtPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({
    price: "",
    sqFt: ""
  });
  const [filterOptions, setFilterOptions] = useState({
    propertyTypes: [
      "Apartment",
      "Villa",
      "Townhouse",
      "Penthouse",
      "Studio",
      "Duplex",
      "Plot",
      "Commercial"
    ],
    priceRanges: [
      "0-100000",
      "100001-500000",
      "500001-1000000",
      "1000001-5000000",
      "5000001+"
    ],
    bedrooms: ["Studio", 1, 2, 3, 4, "4+"],
    bathrooms: [1, 2, 3, 4, "4+"],
    sqFtRanges: [
      "0-1000",
      "1001-2000",
      "2001-3000",
      "3001-4000",
      "4001-5000",
      "5001+"
    ],
    listedAs: ["Available", "Sold", "Reserved", "Under Construction"]
  });
  const router = useRouter();

  const handleReadMore = (slug) => {
    router.push(`/offplan/${slug}`);
  };

  const handleFilterChange = (filters) => {
   
    setCurrentPage(1); // Reset to first page when filters change
    if (filters === null) {
      // If filters are null, fetch all properties
      fetchData(1, {});
      setCurrentFilters({ price: "", sqFt: "" });
    } else {
      // The filters are mostly formatted. We just need to handle bedrooms/bathrooms.
      const formattedFilters = { ...filters };

      // Handle bedroom filtering
      if (formattedFilters.bedrooms) {
        // First, remove any existing bedroom filters to avoid conflicts
        delete formattedFilters.bedrooms_min;
        delete formattedFilters.bedrooms_max;
        
        if (formattedFilters.bedrooms === "0") {
          // When Studio (0 bedrooms) is selected
          formattedFilters.bedrooms = 0;
        } else if (formattedFilters.bedrooms === "4+") {
          // When 4+ is selected, we only set the minimum
          formattedFilters.bedrooms_min = 4;
          delete formattedFilters.bedrooms;
        } else {
          // For specific numbers (1, 2, 3), we set the exact number
          const numBedrooms = parseInt(formattedFilters.bedrooms, 10);
          if (!isNaN(numBedrooms)) {
            formattedFilters.bedrooms = numBedrooms;
          }
        }
      }

      // Handle bathroom filtering
      if (formattedFilters.bathrooms) {
        // First, remove any existing bathroom filters to avoid conflicts
        delete formattedFilters.bathrooms_min;
        delete formattedFilters.bathrooms_max;
        
        if (formattedFilters.bathrooms === "0") {
          // When Studio (0 bathrooms) is selected
          formattedFilters.bathrooms = 0;
        } else if (formattedFilters.bathrooms === "4+") {
          // When 4+ is selected, we only set the minimum
          formattedFilters.bathrooms = 4;
          // Remove the string value to avoid conflicts
          delete formattedFilters.bathrooms;
        } else {
          // For specific numbers (1, 2, 3), ensure it's a number
          const numBathrooms = parseInt(formattedFilters.bathrooms, 10);
          if (!isNaN(numBathrooms)) {
            formattedFilters.bathrooms = numBathrooms;
          }
        }
      }

      // Reconstruct the range strings for the UI state
      const priceRange = (filters.price_min || filters.price_max)
        ? `${filters.price_min || ''}-${filters.price_max || ''}`
        : "";
      const sqFtRange = (filters.sq_ft_min || filters.sq_ft_max)
        ? `${filters.sq_ft_min || ''}-${filters.sq_ft_max || ''}`
        : "";
        
      setCurrentFilters({
        price: priceRange,
        sqFt: sqFtRange,
      });

      // Clean up any undefined or null values
      Object.keys(formattedFilters).forEach(key => {
        if (formattedFilters[key] === undefined || formattedFilters[key] === '') {
          delete formattedFilters[key];
        }
      });

      fetchData(1, formattedFilters);
    }
  };

  const fetchData = async (page, filters = {}) => {
    try {
      const apiUrl = Object.keys(filters).length > 0 ? FILTER_OFFPLAN_API : OFFPLAN_APi;

      // Prepare query parameters
      const queryParams = new URLSearchParams();
      queryParams.append("page", page);

      // Add all filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        // Skip null, undefined, or empty string values
        if (value === null || value === undefined || value === "") {
          return;
        }

        // Handle numbers (convert to string for URLSearchParams)
        if (typeof value === 'number') {
          queryParams.append(key, value.toString());
        }
        // Handle strings (direct append)
        else if (typeof value === 'string') {
          queryParams.append(key, value);
        }
      });

      const url = `${apiUrl}?${queryParams.toString()}`;
      console.log('API Request URL:', url);  // Debug log
      
      const response = await axios.get(url);
      const data = response.data.data;
      setCardData(Array.isArray(data) ? data : [data]);
      setCurrentPage(response.data.current_page);
      setTotalPages(response.data.last_page);
    } catch (error) {
      console.error("Error fetching data:", error);
      setCardData([]); // Clear data on error
    } 
  };

  const fetchFilterOptions = async () => {
    try {
      const response = await axios.get(FILTER_OFFPLAN_API);
      const options = response.data;

      // Extract unique property types from the API response
      const propertyTypes = [
        ...new Set(
          options.data
            .map((item) => item.property_type)
            .filter(Boolean) // Remove null/undefined values
        )
      ].sort();

      // Extract unique values for filters and convert 0 to "Studio", group 4+ as "4+"
      const bedrooms = [
        ...new Set(
          options.data.map((item) => {
            const bedroom = item.bedroom;
            if (bedroom === 0 || bedroom === "0") return "Studio";
            if (bedroom >= 4) return "4+";
            return bedroom;
          })
        )
      ]
        .filter(Boolean)
        .sort((a, b) => {
          // Handle "Studio" and "4+" values
          if (a === "Studio") return -1;
          if (b === "Studio") return 1;
          if (a === "4+") return 1;
          if (b === "4+") return -1;
          return a - b;
        });

      // Extract unique bathroom values and convert 0 to "Studio", group 4+ as "4+"
      const bathrooms = [
        ...new Set(
          options.data.map((item) => {
            const bathroom = item.bathroom;
            if (bathroom === 0 || bathroom === "0") return "Studio";
            if (bathroom >= 4) return "4+";
            return bathroom;
          })
        )
      ]
        .filter(Boolean)
        .sort((a, b) => {
          if (a === "Studio") return -1;
          if (b === "Studio") return 1;
          if (a === "4+") return 1;
          if (b === "4+") return -1;
          return a - b;
        });

      // Update property types if we got valid options from the API
      if (propertyTypes.length > 0) {
        setFilterOptions((prev) => ({
          ...prev,
          propertyTypes
        }));
      }

      // Only update bedrooms if we got valid options from the API
      if (bedrooms.length > 0) {
        setFilterOptions((prev) => ({
          ...prev,
          bedrooms
        }));
      }

      // Update bathrooms if we got valid options from the API
      if (bathrooms.length > 0) {
        setFilterOptions((prev) => ({
          ...prev,
          bathrooms
        }));
      }
    } catch (error) {
      console.error("Error fetching filter options:", error);
      // Keep the default filter options if API call fails
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, page }
        },
        undefined,
        { shallow: true }
      );
      fetchData(page);
    }
  };

  // Fetch data when the component mounts (if no initialData is provided)
  useEffect(() => {
    if (!initialData?.length && !isLoading) {
      fetchData(currentPage);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
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
          filterOptions={filterOptions}
          showPricePopup={showPricePopup}
          setShowPricePopup={setShowPricePopup}
          showSqFtPopup={showSqFtPopup}
          setShowSqFtPopup={setShowSqFtPopup}
          currentFilters={currentFilters}
        />
        {showPricePopup && (
          <div
            className={styles.popupContainer}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowPricePopup(false);
              }
            }}
          >
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
          <div
            className={styles.popupContainer}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowSqFtPopup(false);
              }
            }}
          >
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
        <div className={styles.resultsHeader}>
          <h1 className={styles.title}>Dubai’s Off-Plan Opportunities with High Growth Potential</h1>
         
          <span className={styles.resultsCount}>{cardData.length} results</span>
        </div>
        <h2 className={styles.title_second}> Get early access to pre-launch projects in Dubai’s most promising new communities </h2>
        {isLoading ? (
          <div className={styles.loadingState}>Loading...</div>
        ) : (
          <div className={styles.cardContainer}>
            {cardData
              ?.filter((property) => property?.id)
              .map((property) => (
                <div
                  key={property?.id || Math.random()}
                  className={styles.propertyCardLink}
                  onClick={() =>
                    property?.slug && handleReadMore(property.slug)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <div className={styles.propertyCard}>
                    <div className={styles.imageContainer}>
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
                        className={styles.propertyImage}
                        priority
                        unoptimized
                      />
                      {property?.exclusive && (
                        <span className={styles.exclusive}>Exclusive</span>
                      )}
                    </div>

                    <div className={styles.propertyInfo}>
                      <h3
                        className={`${styles.property_title} ${styles.textEllipsis}`}
                      >
                        {property?.title || "Untitled Property"}
                      </h3>
                      <p
                        className={`${styles.location} ${styles.textEllipsis}`}
                      >
                        {property?.map_location || "Location not specified"}
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
                          <span>
                            {property?.bedroom === 0 ||
                            property?.bedroom === "0"
                              ? "Studio"
                              : property?.bedroom || 0}{" "}
                            Br
                          </span>
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
                          <span>
                            {property?.bathroom || 0}{" "}
                            Ba
                          </span>
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
                          <span>{property?.sq_ft || 0} Sq.m</span>
                        </div>
                        <div
                          className={`${styles.feature} ${styles.textEllipsis}`}
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
                      <div className={styles.priceRow}>
                        <span
                          className={`${styles.price} ${styles.textEllipsis}`}
                        >
                          USD {property?.amount?.toLocaleString() || "0"}
                        </span>
                        <span
                          className={`${styles.price} ${styles.textEllipsis}`}
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
        )}
        <div className={styles.pagination}>
          {isMobile ? (
            <div className={`${styles.mobilePagination} container`} >
             
              <div className={styles.pageInfo}>
               <span className={styles.pageText}>Page</span>
                <select
                  className={styles.pageSelect}
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
                <span className={styles.pageTotal}>of {totalPages}</span>
              </div>
              <button
                className={styles.pageButtonmobile}
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
                className={`${styles.pageButton} ${
                  1 >= 100 ? styles.paginationMany : ""
                } ${currentPage === 1 ? styles.active : ""}`}
                disabled={isLoading}
              >
                1
              </button>

              {/* Ellipsis before the page range if needed */}
              {currentPage > 6 && <span className={styles.ellipsis}>...</span>}

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
                    className={`${styles.pageButton} ${
                      page >= 100 ? styles.paginationMany : ""
                    } ${currentPage === page ? styles.active : ""}`}
                    disabled={isLoading}
                  >
                    {page}
                  </button>
                ))}

              {/* Ellipsis after the page range if needed */}
              {currentPage < totalPages - 5 && (
                <span className={styles.ellipsis}>...</span>
              )}

              {/* Last Page (if not already in range) */}
              {totalPages > 1 && currentPage < totalPages - 5 && (
                <button
                  key={totalPages}
                  onClick={() => handlePageChange(totalPages)}
                  className={`${styles.pageButton} ${
                    totalPages >= 100 ? styles.paginationMany : ""
                  } ${currentPage === totalPages ? styles.active : ""}`}
                  disabled={isLoading}
                >
                  {totalPages}
                </button>
              )}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className={styles.pageButton}
              >
                Next
              </button>
            </>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Offplan;
