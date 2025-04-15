import React, { useState, useEffect } from "react";
import styles from "./blog.module.css";
import baseimage from "../../assets/img/blogimage.png";
import Image from "next/image";
import BlogIcon from "../../assets/img/calendaricon.png";
import SubscribeSection from "../SubscribeSection/SubscribeSection";
import axios from "axios";
import { BLOGS_API } from "../../routes/apiRoutes";
import { useRouter } from "next/router";
import { LoadingWrapper } from "../LoadingWrapper/index";
import { useMediaQuery } from "react-responsive";

const Blog = ({ initialData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [cardData, setCardData] = useState(initialData || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const router = useRouter();

  useEffect(() => {
    const fetchData = async (page) => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${BLOGS_API}?page=${page}`);
        setCardData(response.data.data);
        setTotalPages(response.data.last_page);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!initialData) {
      fetchData(currentPage);
    }
  }, [currentPage, initialData]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
        <h1>Articles</h1>
      </div>
      <LoadingWrapper isLoading={isLoading}>
        <div className="row">
          {cardData.map((card, index) => (
            <div className="col-md-3 col-12" key={index}>
              <div className={`${styles.card}`}>
                <div className={styles.imageContainer}>
                <Image
                  src={
                    card.image
                      ? `${
                          process.env.NEXT_PUBLIC_API_URL
                        }/storage/${decodeImageUrl(card.image)}`
                      : baseimage
                  }
                  className={styles["card-img-top"]}
                  alt={card.image_alt || card.title}
                  width={372}
                  height={200}
                  priority={index < 2}
                />
                </div>
                <div className={styles["card-body"]}>
                  <h5 className={styles["card-title"]}>
                    {limitTextLength(card.title, 40)}
                  </h5>
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
      {/* SubscribeSection moved here */}
      {isMobile ? (
        <SubscribeSection />
      ) : (
        <div className="container">
          <SubscribeSection />
        </div>
      )}
    </div> 
  );
};

export default Blog;