import React, { useState, useEffect } from "react";
import styles from "./blog.module.css"; // Corrected the CSS module import
import baseimage from "../../assets/img/blogimage.png"; // Ensure this path is correct
import Image from "next/image";
import BlogIcon from "../../assets/img/calendaricon.png"; // Ensure this path is correct
import SubscribeSection from "../SubscribeSection/SubscribeSection";
import axios from "axios";
import { BLOGS_API } from "../../routes/apiRoutes"; // Import the route
import { useRouter } from "next/router"; // Import useRouter
import { LoadingWrapper } from "../LoadingWrapper/index";
const Blog = ({ initialData }) => {
   const [isLoading, setIsLoading] = useState(false);
  const [cardData, setCardData] = useState(initialData || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    // Log the environment variable to ensure it's correctly set

    // Fetch data from the API
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
    const strippedText = text.replace(/(<([^>]+)>)/gi, ""); // Remove HTML tags
    return strippedText.length > maxLength
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
           
          <div className="col-md-3" key={index}>
            <div className={`card ${styles.card}`}>
              <Image
                src={
                  card.image
                    ? `${
                        process.env.NEXT_PUBLIC_API_URL
                      }/storage/${decodeImageUrl(card.image)}`
                    : baseimage
                }
                className={`card-img-top ${styles["card-img-top"]}`}
                alt={card.image_alt || card.title}
                width={372} // Provide width
                height={200} // Provide height
                priority={true} // Add priority property
              />
             <div className={`card-body ${styles['card-body']}`}>
                <h5 className={`card-title ${styles['card-title']}`}>{card.title}</h5>
                <div className={styles.contentWrapper}> {/* Add this wrapper */}
                    <ul className={`list-unstyled ${styles['card-list']}`}>
                        <li className={`${styles.date}`}>
                            <Image 
                                src={BlogIcon} 
                                alt={card.image_alt || card.title}
                                width={16} 
                                height={16} 
                                style={{ marginRight: 8 }}
                            /> 
                            <span className={styles.formattedDate}>{formatDate(card.date)}</span>
                        </li>
                        <li className={styles.description}>{limitTextLength(card.body, 108)}</li>
                    </ul>
                    <button 
                        onClick={() => handleReadMore(card.slug)} 
                        className={`btn btn-primary ${styles['card-button']}`}
                    >
                        Read more
                    </button>
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
      <SubscribeSection />
    </div>
  );
};

export default Blog;
