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
  const [showPricePopup, setShowPricePopup] = useState(false);
  const [showSqFtPopup, setShowSqFtPopup] = useState(false);
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
    priceRanges: ["0-100000", "100001-500000", "500001-1000000", "1000001-5000000", "5000001+"],
    bedrooms: ["Studio", 1, 2, 3, 4, "4+"],
    bathrooms: ["Studio", 1, 2, 3, 4, "4+"],
    sqFtRanges: ["0-1000", "1001-2000", "2001-3000", "3001-4000", "4001-5000", "5001+"],
    listedAs: ["Available", "Sold", "Reserved", "Under Construction"],
  });
  const router = useRouter();

  const handleReadMore = (slug) => {
    router.push(`/offplan/${slug}`);
  };

  const handleFilterChange = (filters) => {
    setCurrentPage(1); // Reset to first page when filters change
    if (filters === null) {
      // If filters are null, fetch all properties
      fetchData(1);
      setCurrentFilters({ price: "", sqFt: "" });
    } else {
      // Update current filters state with the raw filter values
      setCurrentFilters(prev => ({
        ...prev,
        price: filters.price || "",
        sqFt: filters.sqFt || ""
      }));
      
      // Format the filters to match backend expectations
      const formattedFilters = {};
      
      // Handle price range
      if (filters.price) {
        const [priceMin, priceMax] = filters.price.split('-');
        formattedFilters.price_min = priceMin || null;
        formattedFilters.price_max = priceMax || null;
      }

      // Handle sqFt range
      if (filters.sqFt) {
        const [sqFtMin, sqFtMax] = filters.sqFt.split('-');
        formattedFilters.sq_ft_min = sqFtMin || null;
        formattedFilters.sq_ft_max = sqFtMax || null;
      }

      // Add other filters
      if (filters.propertyType) formattedFilters.property_type = filters.propertyType;
      if (filters.bedrooms) {
        if (filters.bedrooms === "Studio") {
          formattedFilters.bedrooms = 0;
        } else if (filters.bedrooms === "4+") {
          formattedFilters.bedrooms_min = 4;
        } else {
          formattedFilters.bedrooms = filters.bedrooms;
        }
      }
      if (filters.bathrooms) {
        if (filters.bathrooms === "Studio") {
          formattedFilters.bathrooms = 0;
        } else if (filters.bathrooms === "4+") {
          formattedFilters.bathrooms_min = 4;
        } else {
          formattedFilters.bathrooms = filters.bathrooms;
        }
      }
      if (filters.searchQuery) formattedFilters.location = filters.searchQuery;

      fetchData(1, formattedFilters);
    }
  };

  const fetchData = async (page, filters = {}) => {
    setIsLoading(true);
    try {
      const apiUrl = Object.keys(filters).length > 0 ? FILTER_OFFPLAN_API : OFFPLAN_APi;
     
      
      // Prepare query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      
      // Add all filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          queryParams.append(key, value);
        }
      });

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

  const fetchFilterOptions = async () => {
    try {
      const response = await axios.get(FILTER_OFFPLAN_API);
      console.log(response.data);
      const options = response.data;

      // Extract unique values for filters and convert 0 to "Studio", group 4+ as "4+"
      const bedrooms = [...new Set(options.data.map((item) => {
        const bedroom = item.bedroom;
        if (bedroom === 0 || bedroom === "0") return "Studio";
        if (bedroom >= 4) return "4+";
        return bedroom;
      }))]
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
      const bathrooms = [...new Set(options.data.map((item) => {
        const bathroom = item.bathroom;
        if (bathroom === 0 || bathroom === "0") return "Studio";
        if (bathroom >= 4) return "4+";
        return bathroom;
      }))]
        .filter(Boolean)
        .sort((a, b) => {
          if (a === "Studio") return -1;
          if (b === "Studio") return 1;
          if (a === "4+") return 1;
          if (b === "4+") return -1;
          return a - b;
        });

      // Only update bedrooms if we got valid options from the API
      if (bedrooms.length > 0) {
        setFilterOptions(prev => ({
          ...prev,
          bedrooms,
        }));
      }

      // Update bathrooms if we got valid options from the API
      if (bathrooms.length > 0) {
        setFilterOptions(prev => ({
          ...prev,
          bathrooms,
        }));
      }
    } catch (error) {
      console.error("Error fetching filter options:", error);
      // Keep the default bedroom and bathroom options if API call fails
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, page },
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
          <div className={styles.popupContainer} onClick={(e) => {
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
          <div className={styles.popupContainer} onClick={(e) => {
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
        <div className={styles.resultsHeader}>
          <h2 className={styles.title}>New Developments for sale in Dubai</h2>
          <span className={styles.resultsCount}>{cardData.length} results</span>
        </div>

        {isLoading ? (
          <div className={styles.loadingState}>Loading...</div>
        ) : (
          <div className={styles.cardContainer}>
            {cardData?.filter(property => property?.id).map((property) => (
             
              <div
                key={property?.id || Math.random()}
                className={styles.propertyCardLink}
                onClick={() => property?.slug && handleReadMore(property.slug)}
                style={{ cursor: "pointer" }}
              >
                <div className={styles.propertyCard}>
                  <div className={styles.imageContainer}>
                    <Image
                      src={
                        property?.main_photo
                          ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(property.main_photo)}`
                          : defaultImage
                      }
                      alt={property?.alt_texts?.main_photo || property?.title || "Default Property Image"}
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
                    <h3 className={`${styles.property_title} ${styles.textEllipsis}`}>
                      {property?.title || 'Untitled Property'}
                    </h3>
                    <p className={`${styles.location} ${styles.textEllipsis}`}>
                      {property?.map_location || 'Location not specified'}
                    </p>

                    <div className={styles.features}>
                      <div className={`${styles.feature} ${styles.textEllipsis}`}>
                        <Image
                          src={require("/assets/img/bad.svg")}
                          alt="Bed Icon"
                          width={24}
                          height={24}
                        />
                        <span>{property?.bedroom === 0 || property?.bedroom === "0" ? "Studio" : property?.bedroom || 0} Br</span>
                      </div>
                      <div className={`${styles.feature} ${styles.textEllipsis}`}>
                        <Image
                          src={require("/assets/img/bath.svg")}
                          alt="Bath Icon"
                          width={24}
                          height={24}
                        />
                        <span>{property?.bathroom === 0 || property?.bathroom === "0" ? "Studio" : property?.bathroom || 0} Ba</span>
                      </div>
                      <div className={`${styles.feature} ${styles.textEllipsis}`}>
                        <Image
                          src={require("/assets/img/place.svg")}
                          alt="Area Icon"
                          width={24}
                          height={24}
                        />
                        <span>{property?.sq_ft || 0} Sq.m</span>
                      </div>
                      <div className={`${styles.feature} ${styles.textEllipsis}`}>
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
                      <span className={`${styles.price} ${styles.textEllipsis}`}>
                        USD {property?.amount?.toLocaleString() || '0'}
                      </span>
                      <span className={`${styles.price} ${styles.textEllipsis}`}>
                        AED {property?.amount_dirhams?.toLocaleString() || '0'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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