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
import { LoadingWrapper } from "../LoadingWrapper/index";
import SubscribeSection from "../SubscribeSection/SubscribeSection";
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
      setFilteredData(cardData);
      setTotalPages(initialPagination?.last_page || 1);
      setCurrentPage(initialPagination?.current_page || 1);
    }
  }, [searchQuery, cardData, initialPagination]);

  const handleSearch = async (e) => {
    if (e.key === 'Enter' && searchQuery.length >= 3) {
      setIsLoading(true);
      try {
        const response = await axios.get(`${DEVELOPER_SEARCH_API}`, {
          params: {
            search: searchQuery,
            per_page: 10
          }
        });
        console.log('Search Response:', response.data); // Debug log
        const { data, meta } = response.data;
        
        // Ensure data is properly structured
        const processedData = Array.isArray(data) ? data : [data];
        console.log('Processed Data:', processedData); // Debug log
        
        // Update both filteredData and cardData
        setCardData(processedData);
        setFilteredData(processedData);
        setTotalPages(meta.last_page);
        setCurrentPage(meta.current_page);
      } catch (error) {
        console.error("Error searching developers:", error);
        setFilteredData([]);
        setCardData([]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle page change for search results
  const handlePageChangeForSearch = async (page) => {
    if (page !== currentPage) {
      setIsLoading(true);
      try {
        const response = await axios.get(`${DEVELOPER_SEARCH_API}`, {
          params: {
            search: searchQuery,
            per_page: 10,
            page: page
          }
        });
        const { data, meta } = response.data;
        setFilteredData(Array.isArray(data) ? data : [data]);
        setTotalPages(meta.last_page);
        setCurrentPage(meta.current_page);
      } catch (error) {
        console.error("Error fetching page:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle "Read More" button click
  const handleReadMore = (slug) => {
    router.push(`/developer/${slug}`);
  };

  // Get image URL for a card
  const getImageUrl = (photoJson, cardId) => {
    try {
      const photos = Array.isArray(photoJson) ? photoJson : JSON.parse(photoJson);
      if (Array.isArray(photos) && photos.length > 0) {
        const currentIndex = imageIndexes[cardId] || 0;
        return `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeURIComponent(
          photos[currentIndex].file
        )}`;
      }
      return defaultImage;
    } catch (e) {
      return defaultImage;
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

  if (!filteredData || filteredData.length === 0) {
    return <div className="text-center py-5">No developers found</div>;
  }

  return (
    <LoadingWrapper isLoading={isLoading}>
      <>
        <div className="container py-4">
          {/* Search Section */}
          <div className={`mb-4 position-relative ${styles.searchContainer}`}>
            <input
              type="text"
              placeholder="City, Building or community"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className={`form-control ${styles.searchInput}`}
            />
            <FaSearch className={`position-absolute ${styles.searchIcon}`} />
          </div>

          {/* Developer Cards */}
          <div className={styles.cardsContainer}>
            {filteredData.map((card) => (
              <div key={card.id} className={styles.cardWrapper}>
                <div className={styles.card}>
                  <div className={styles.cardRow}>
                    {/* Image Section */}
                    <div className={styles.imageContainer}>
                      {isMobile && (
                        <div className={styles.mobileTitleOverlay}>
                          <h2 className={styles.mobileTitle}>{card.title}</h2>
                        </div>
                      )}
                      <Image
                        src={getImageUrl(card.photo, card.id)}
                        alt={card.title}
                        width={400}
                        height={300}
                        className={styles.cardImage}
                        style={{ objectFit: "cover" }}
                      />
                      {Array.isArray(card.photo) && card.photo.length > 1 && (
                        <div className={styles.imageNav}>
                          <button
                            onClick={() => handlePrevImage(card.id, card.photo)}
                            className={styles.prevButtonimage}
                          >
                            <FaChevronLeft />
                          </button>
                          <button
                            onClick={() => handleNextImage(card.id, card.photo)}
                            className={styles.nextButtonimage}
                          >
                            <FaChevronRight />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className={styles.cardContent}>
                      <h2 className={styles.title}>{card.title}</h2>
                      <div className={styles.description}>
                        <div dangerouslySetInnerHTML={{ __html: card.paragraph }} />
                      </div>
                      <div className={styles.communitiesSection}>
                        <h3 className={styles.communitiesTitle}>Top Communities</h3>
                        <div className={styles.communitiesList}>
                          {Array.isArray(card.tags) ? card.tags.map((tag, index) => (
                            <span key={index} className={styles.badge}>
                              {tag}
                            </span>
                          )) : JSON.parse(card.tags || '[]').map((tag, index) => (
                            <span key={index} className={styles.badge}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Buttons Section */}
                      <div className={styles.buttonsSection}>
                        {/* Left Side: Call and WhatsApp Buttons */}
                        <div className={styles.contactButtons}>
                          <button
                            className={styles.call}
                            onClick={() => (window.location.href = `tel:${card.phone}`)}
                          >
                            <FaPhone />
                            <span>Call</span>
                          </button>
                          <button
                            className={styles.whatsapp}
                            onClick={() => window.open(`https://wa.me/${card.whatsapp}`, "_blank")}
                          >
                            <FaWhatsapp />
                            <span>WhatsApp</span>
                          </button>
                        </div>

                        {/* Right Side: See More Button */}
                        <button className={styles.readMore} onClick={() => handleReadMore(card.slug)}>
                          See More
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className={styles.pagination}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChangeForSearch(page)}
                className={`${styles.pageButton} ${
                  currentPage === page ? styles.active : ""
                }`}
                disabled={isLoading}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChangeForSearch(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              className={styles.pageButton}
            >
              Next
            </button>
          </div>
        </div>
        {isMobile ? (
          <SubscribeSection />
        ) : (
          <div className="container">
            <SubscribeSection />
          </div>
        )}
      </>
    </LoadingWrapper>
  );
};

export default Developer;