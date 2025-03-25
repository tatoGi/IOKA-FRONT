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
  const router = useRouter();

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
    }
  };

  // Limit text length
  const limitTextLength = (text, maxLength) => {
    const strippedText = text.replace(/(<([^>]+)>)/gi, "");
    return strippedText.length > maxLength
      ? strippedText.substring(0, maxLength) + "..."
      : strippedText;
  };

  // Fetch data when the component mounts
  useEffect(() => {
    if (!initialData) {
      fetchData(currentPage);
    }
  }, [currentPage, initialData]);

  // Filter data based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = cardData.filter((card) =>
        card.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(cardData);
    }
  }, [searchQuery, cardData]);

  // Handle "Read More" button click
  const handleReadMore = (slug) => {
    router.push(`/developer/${slug}`);
  };

  // Get image URL for a card
  const getImageUrl = (photoJson, cardId) => {
    try {
      const parsed = JSON.parse(photoJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const currentIndex = imageIndexes[cardId] || 0;
        return `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeURIComponent(
          parsed[currentIndex].file
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
      const parsed = JSON.parse(photoJson);
      if (Array.isArray(parsed)) {
        setImageIndexes((prev) => ({
          ...prev,
          [cardId]: ((prev[cardId] || 0) + 1) % parsed.length,
        }));
      }
    } catch (e) {
      console.error("Error navigating images:", e);
    }
  };

  // Handle previous image button click
  const handlePrevImage = (cardId, photoJson) => {
    try {
      const parsed = JSON.parse(photoJson);
      if (Array.isArray(parsed)) {
        setImageIndexes((prev) => ({
          ...prev,
          [cardId]: ((prev[cardId] || 0) - 1 + parsed.length) % parsed.length,
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
      <div className="container py-4">
        {/* Search Section */}
        <div className={`mb-4 position-relative ${styles.searchContainer}`}>
          <input
            type="text"
            placeholder="City, Building or community"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
                    <Image
                      src={getImageUrl(card.photo, card.id)}
                      alt={card.title}
                      width={400}
                      height={300}
                      className={styles.cardImage}
                      style={{ objectFit: "cover" }}
                    />
                    {JSON.parse(card.photo)?.length > 1 && (
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
                      <p>{limitTextLength(card.paragraph, 400)}</p>
                    </div>
                    <div className={styles.communitiesSection}>
                      <h3 className={styles.communitiesTitle}>Top Communities</h3>
                      <div className={styles.communitiesList}>
                        {JSON.parse(card.tags).map((tag, index) => (
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
        <div className={`d-flex justify-content-center ${styles.pagination}`}>
          <button
            className={`btn ${styles.prevButton}`}
            disabled={currentPage === 1 || isLoading}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <FaChevronLeft />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`btn ${styles.pageButton} ${currentPage === page ? styles.active : ""}`}
              disabled={isLoading}
            >
              {page}
            </button>
          ))}
          <button
            className={`btn ${styles.nextButton}`}
            disabled={currentPage === totalPages || isLoading}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <FaChevronRight />
          </button>
        </div>

        <SubscribeSection />
      </div>
    </LoadingWrapper>
  );
};

export default Developer;