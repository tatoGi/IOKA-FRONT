import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPhone,
  FaWhatsapp,
  FaSearch,
} from "react-icons/fa";
import { useRouter } from "next/router";
import axios from "axios";
import { DEVELOPER_API } from "@/routes/apiRoutes";
import styles from "./Developer.module.css";
import defaultImage from "../../assets/img/default.webp";
import { DEVELOPER_SEARCH_API } from "@/routes/apiRoutes";

const Developer = ({ initialData, initialPagination }) => {
  const [cardData, setCardData] = useState(initialData || []);
  const [filteredData, setFilteredData] = useState(initialData || []);
  const [currentPage, setCurrentPage] = useState(
    initialPagination?.current_page || 1
  );
  const [totalPages, setTotalPages] = useState(
    initialPagination?.last_page || 1
  );
  const [imageIndexes, setImageIndexes] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(max-width: 768px)");
      setIsMobile(mediaQuery.matches);

      const handleResize = () => setIsMobile(mediaQuery.matches);
      mediaQuery.addEventListener("change", handleResize);

      return () => mediaQuery.removeEventListener("change", handleResize);
    }
  }, []);

  // Fetch data for the selected page
  const fetchData = async (page) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${DEVELOPER_API}?page=${page}`);
      const data = response.data.data;
      setCardData(Array.isArray(data) ? data : [data]);
      setFilteredData(Array.isArray(data) ? data : [data]);
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
      fetchData(page);
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, page },
        },
        undefined,
        { shallow: true }
      );
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    if (!initialData) {
      fetchData(currentPage);
    }
  }, [currentPage, initialData]);

  // Filter data based on search query
  useEffect(() => {
    if (!searchQuery) {
      // Only reset if we're not in the middle of a search
      if (filteredData !== cardData) {
        setFilteredData(cardData);
        setTotalPages(initialPagination?.last_page || 1);
        setCurrentPage(initialPagination?.current_page || 1);
      }
    }
  }, [searchQuery, cardData, initialPagination, filteredData]);

  const handleSearch = async (searchText) => {
    if (searchText.length < 3) {
      setFilteredData(cardData);
      setNoResults(false);
      setTotalPages(initialPagination?.last_page || 1);
      setCurrentPage(initialPagination?.current_page || 1);
      return;
    }

    setIsLoading(true);
    setNoResults(false);
    try {
      const response = await axios.get(`${DEVELOPER_SEARCH_API}`, {
        params: {
          search: searchText,
          per_page: 10,
        },
      });

      const { data, meta } = response.data;

      if (data.data.length === 0) {
        setFilteredData([]);
        setNoResults(true);
        setTotalPages(0);
        setCurrentPage(1);
      } else {
        const processedData = data.data.map((developer) => ({
          id: developer.id,
          title: developer.title || "No Title",
          paragraph: developer.paragraph || "No Description",
          tags:
            typeof developer.tags === "string"
              ? JSON.parse(developer.tags || "[]")
              : Array.isArray(developer.tags)
              ? developer.tags
              : [],
          photo:
            typeof developer.photo === "string"
              ? JSON.parse(developer.photo || "[]")
              : Array.isArray(developer.photo)
              ? developer.photo
              : [],
          phone: developer.phone || "",
          whatsapp: developer.whatsapp || "",
          slug: developer.slug || "",
          awards: developer.awards || [],
          offplan_listings: developer.offplan_listings || [],
          rental_listings: developer.rental_listings || [],
          rental_resale_listings: developer.rental_resale_listings || [],
        }));

        setFilteredData(processedData);
        setTotalPages(meta.last_page);
        setCurrentPage(meta.current_page);
      }
    } catch (error) {
      console.error("Error searching developers:", error);
      setFilteredData([]);
      setNoResults(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search input changes
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Debounce search
    const timer = setTimeout(() => {
      handleSearch(value);
    }, 500);

    return () => clearTimeout(timer);
  };

  // Handle search icon click
  const handleSearchIconClick = () => {
    if (searchQuery.length >= 3) {
      handleSearch(searchQuery);
    }
  };

  // Handle page change for search results
  const handlePageChangeForSearch = async (page) => {
    if (page === currentPage) return;

    setIsLoading(true);
    try {
      const response = searchQuery.length >= 3
        ? await axios.get(DEVELOPER_SEARCH_API, {
            params: {
              search: searchQuery,
              per_page: 10,
              page: page,
            },
          })
        : await axios.get(DEVELOPER_API, {
            params: {
              page: page,
              per_page: 10,
            },
          });

      const { data, meta } = response.data;

      // Process the data to match the expected format
      const processedData = Array.isArray(data) ? data : [data];

      setCardData(processedData);
      setFilteredData(processedData);
      setTotalPages(meta.last_page);
      setCurrentPage(meta.current_page);

      // Update URL with current page
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, page },
        },
        undefined,
        { shallow: true }
      );
    } catch (error) {
      console.error("Error fetching page:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle "Read More" button click
  const handleReadMore = (slug) => {
    router.push(`/developer/${slug}`);
  };

  // Get image URL for a card
  const getImageUrl = (photoJson, cardId) => {
    try {
      if (!photoJson || (Array.isArray(photoJson) && photoJson.length === 0)) {
        return {defaultImage, alt: 'Default developer image' };
      }
      const photos = Array.isArray(photoJson) ? photoJson : JSON.parse(photoJson);
      if (Array.isArray(photos) && photos.length > 0 && photos[0] && photos[0].file) {
        const currentIndex = imageIndexes[cardId] || 0;
        const currentPhoto = photos[currentIndex];
        const imageUrl = decodeURIComponent(currentPhoto.file);

        // Check if the URL is absolute
        const isAbsoluteUrl = /^(?:[a-z]+:)?\/\//i.test(imageUrl);
        const finalUrl = isAbsoluteUrl
          ? imageUrl
          : `${process.env.NEXT_PUBLIC_API_URL}/storage/${imageUrl}`;

        return {
          url: finalUrl,
          alt: currentPhoto.alt || 'Developer image',
        };
      }
      return {  defaultImage, alt: 'Default developer image' };
    } catch (e) {
      return {  defaultImage, alt: 'Default developer image' };
    }
  };

  // Handle next image button click
  const handleNextImage = (cardId, photoJson) => {
    try {
      const photos = Array.isArray(photoJson) ? photoJson : JSON.parse(photoJson);
      if (Array.isArray(photos)) {
        setImageIndexes((prev) => ({
          ...prev,
          [cardId]: ((prev[cardId] || 0) + 1) % photos.length,
        }));
      }
    } catch (e) {
      console.error("Error navigating images:", e);
    }
  };

  // Handle previous image button click
  const handlePrevImage = (cardId, photoJson) => {
    try {
      const photos = Array.isArray(photoJson) ? photoJson : JSON.parse(photoJson);
      if (Array.isArray(photos)) {
        setImageIndexes((prev) => ({
          ...prev,
          [cardId]: ((prev[cardId] || 0) - 1 + photos.length) % photos.length,
        }));
      }
    } catch (e) {
      console.error("Error navigating images:", e);
    }
  };

  return (
    <>
   
      <div className="container py-4">
      <h1 className={styles.title_main}> Trusted Developers Behind Iconic Projects in Dubai</h1>
      <h2 className={styles.title_second}>
      Learn more about developers, their values, and vision
      </h2>
        {/* Search Section */}
        <div className={`mb-4 position-relative ${styles.searchContainer}`}>
          <input
            type="text"
            placeholder="City, Building or community"
            value={searchQuery}
            onChange={handleSearchInputChange}
            className={`form-control ${styles.searchInput}`}
          />
          <FaSearch
            className={`position-absolute ${styles.searchIcon}`}
            onClick={handleSearchIconClick}
            style={{ cursor: "pointer" }}
          />
        </div>

        {/* Developer Cards */}
        <div className={styles.cardsContainer} style={{ minHeight: "600px" }}>
          {isLoading ? (
            <div className="text-center py-5">Loading...</div>
          ) : noResults ? (
            <div className="text-center py-5">No developers found.</div>
          ) : (
            filteredData.map((card) => (
              <div key={card.id} className={styles.cardWrapper}>
                <div className={styles.card}>
                  <div className={styles.cardRow}>
                    {/* Image Section */}
                    <div className={styles.imageContainer}>
                      {isMobile && (
                        <div className={styles.mobileTitleOverlay}>
                          <h3 className={styles.mobileTitle}>{card.title}</h3>
                        </div>
                      )}
                      <Image
                        src={getImageUrl(card.photo, card.id).url}
                        alt={getImageUrl(card.photo, card.id).alt}
                        width={400}
                        height={300}
                        className={styles.cardImage}
                        style={{ objectFit: "cover" }}
                      />
                      {Array.isArray(card.photo) && card.photo.length > 1 && (
                        <div className={styles.imageNav}>
                          <button
                            onClick={() =>
                              handlePrevImage(card.id, card.photo)
                            }
                            className={styles.prevButtonimage}
                          >
                            <FaChevronLeft />
                          </button>
                          <button
                            onClick={() =>
                              handleNextImage(card.id, card.photo)
                            }
                            className={styles.nextButtonimage}
                          >
                            <FaChevronRight />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className={styles.cardContent}>
                      <h3 className={styles.title}>{card.title}</h3>
                      <div className={styles.description}>
                        <div
                          dangerouslySetInnerHTML={{ __html: card.paragraph }}
                        />
                      </div>
                      <div className={styles.communitiesSection}>
                        <h3 className={styles.communitiesTitle}>
                          Top Communities
                        </h3>
                        <div className={styles.communitiesList}>
                          {Array.isArray(card.tags)
                            ? card.tags.map((tag, index) => (
                                <span key={index} className={styles.badge}>
                                  {tag}
                                </span>
                              ))
                            : JSON.parse(card.tags || "[]").map(
                                (tag, index) => (
                                  <span key={index} className={styles.badge}>
                                    {tag}
                                  </span>
                                )
                              )}
                        </div>
                      </div>

                      {/* Buttons Section */}
                      <div className={styles.buttonsSection}>
                        {/* Left Side: Call and WhatsApp Buttons */}
                        <div className={styles.contactButtons}>
                          <button
                            className={styles.call}
                            onClick={() =>
                              (window.location.href = `tel:${card.phone}`)
                            }
                          >
                            <FaPhone />
                            <span>Call</span>
                          </button>
                          <button
                            className={styles.whatsapp}
                            onClick={() =>
                              window.open(
                                `https://wa.me/${card.whatsapp}`,
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
                          className={styles.readMore}
                          onClick={() => handleReadMore(card.slug)}
                        >
                          See More
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {!isLoading && !noResults && filteredData.length > 0 && (
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
        )}
      </div>
    </>
  );
};

export default Developer;