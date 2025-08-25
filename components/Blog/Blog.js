import React, { useState, useEffect, useCallback } from "react";
import styles from "./blog.module.css";
import baseimage from "../../assets/img/blogimage.png";
import Image from "next/image";
import BlogIcon from "../../assets/img/calendaricon.svg";
import axios from "axios";
import { BLOGS_API } from "../../routes/apiRoutes";
import { useRouter } from "next/router";
import { useMediaQuery } from "react-responsive";

const Blog = ({ initialData, initialTotalPages = 1, initialPage = 1, section = '' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [cardData, setCardData] = useState(initialData || []);
  const [currentPage, setCurrentPage] = useState(initialPage || 1);
  const [totalPages, setTotalPages] = useState(initialTotalPages || 1);
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchData = useCallback(async (page) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      if (section) params.set('section', section);
      const response = await axios.get(`${BLOGS_API}?${params.toString()}`);
      setCardData(response.data.data);
      setTotalPages(response.data.last_page);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [section]);

  useEffect(() => {
    if (!initialData) {
      fetchData(currentPage);
    }
  }, [currentPage, initialData, fetchData]);

  // Don't render until component is mounted to prevent hydration mismatch
  if (!isMounted) {
    return null;
  }
  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, page, ...(section ? { section } : {}) }
        },
        undefined,
        { shallow: true }
      );
      fetchData(page);
    }
  };

  const limitTextLength = (text, maxLength) => {
    const strippedText = text.replace(/(<([^>]+)>)/gi, "");
    return strippedText.length > maxLength || strippedText.length <= 3
      ? strippedText.substring(0, maxLength) + "..."
      : strippedText;
  };

  const handleReadMore = (slug) => {
    router.push(`/blog/${slug}`);
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const decodeImageUrl = (url) => {
    return decodeURIComponent(url);
  };

  return (
    <div className="container mt-3">
      <div className={`${styles.title}`}>
        <h1> Insights from Dubai’s Real Estate Market</h1>
        <h2>Read articles, news, and lifestyle advices from industry experts</h2>
      </div>
      <div className="row">
        {cardData.map((card, index) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={index}>
            <div className={`${styles.card}`}>
              <div className={styles.imageContainer}>
                <Image
                  src={
                    isMobile
                      ? card.mobile_image
                        ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(card.mobile_image)}`
                        : card.image
                        ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(card.image)}`
                        : baseimage
                      : card.image
                      ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(card.image)}`
                      : baseimage
                  }
                  className={styles["card-img-top"]}
                  alt={card.image_alt || card.title}
                  width={372}
                  height={200}
                />
              </div>
              <div className={styles["card-body"]}>
                <h3 className={styles["card-title"]}>
                  {limitTextLength(card.title, 30)}
                </h3>
                <div className={styles.date}>
                  <Image
                    src={BlogIcon}
                    alt="Calendar"
                    width={16}
                    height={16}
                    style={{ marginRight: 8 }}
                  />
                  <span className={styles.formattedDate}>
                    {formatDate(card.date)}
                  </span>
                </div>
                <p className={styles.description}>
                  {limitTextLength(card.body, 108)}
                </p>
                <button
                  onClick={() => handleReadMore(card.slug)}
                  className={styles["card-button"]}
                >
                  Read more
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
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
  );
};

export default Blog;
