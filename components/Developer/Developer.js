import React, { useState, useEffect } from "react";
import styles from "./Developer.module.css";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight, FaPhone, FaWhatsapp } from "react-icons/fa";
import { useRouter } from "next/router";
import axios from "axios";
import { DEVELOPER_API } from "@/routes/apiRoutes";

const Developer = ({ initialData }) => {
  const [cardData, setCardData] = useState(initialData || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [imageIndexes, setImageIndexes] = useState({}); // Track image indexes per card

  const router = useRouter();

  useEffect(() => {
    const fetchData = async (page) => {
      try {
        const response = await axios.get(`${DEVELOPER_API}?page=${page}`);
        setCardData(response.data.data);
        setTotalPages(response.data.last_page);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (!initialData) {
      fetchData(currentPage);
    }
  }, [currentPage, initialData]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleReadMore = (slug) => {
    router.push(`/developer/${slug}`);
  };

  const decodeImageUrl = (url) => {
    return decodeURIComponent(url);
  };

  const getImageUrl = (photoJson, cardId) => {
    try {
      const parsed = JSON.parse(photoJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const currentIndex = imageIndexes[cardId] || 0;
        const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(parsed[currentIndex].file)}`;
        console.log(`Image URL for card ${cardId}:`, imageUrl); // Debugging log
        return imageUrl;
      }
      return "/default-image.jpg";
    } catch (e) {
      console.error("Error parsing photo JSON:", e);
      return "/default-image.jpg";
    }
  };

  const handleNextImage = (cardId, photoJson) => {
    try {
      const parsed = JSON.parse(photoJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setImageIndexes((prevIndexes) => {
          const newIndex = (prevIndexes[cardId] + 1) % parsed.length; // Loop back to first image
          console.log(`Next image index for card ${cardId}:`, newIndex); // Debugging log
          return {
            ...prevIndexes,
            [cardId]: newIndex,
          };
        });
      }
    } catch (e) {
      console.error("Error navigating images:", e);
    }
  };

  const handlePrevImage = (cardId, photoJson) => {
    try {
      const parsed = JSON.parse(photoJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setImageIndexes((prevIndexes) => {
          const newIndex = (prevIndexes[cardId] - 1 + parsed.length) % parsed.length; // Loop back to last image
          console.log(`Previous image index for card ${cardId}:`, newIndex); // Debugging log
          return {
            ...prevIndexes,
            [cardId]: newIndex,
          };
        });
      }
    } catch (e) {
      console.error("Error navigating images:", e);
    }
  };

  return (
    <div className={styles.contentSection}>
    <h2 className={styles.companyTitle}>{card.title}</h2>
    
    <div className={styles.aboutSection}>
      <h3 className={styles.sectionHeading}>About Company</h3>
      <div className={styles.companyDescription} dangerouslySetInnerHTML={{ __html: card.paragraph }} />
    </div>
  
    <div className={styles.communitiesSection}>
      <h3 className={styles.sectionHeading}>Top Communities</h3>
      <div className={styles.communityGrid}>
        {JSON.parse(card.tags).map((tag, index) => (
          <span key={index} className={styles.communityItem}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  
    <div className={styles.contactSection}>
      <div className={styles.contactButtons}>
        <button className={styles.callButton}>
          <FaPhone size={16} />
          <span>Call</span>
          <span className={styles.contactNumber}>{card.phone}</span>
        </button>
        <button className={styles.whatsappButton}>
          <FaWhatsapp size={16} />
          <span>WhatsApp</span>
          <span className={styles.contactNumber}>{card.whatsapp}</span>
        </button>
      </div>
      <button 
        className={styles.seeMoreButton}
        onClick={() => handleReadMore(card.slug)}
      >
        See More
      </button>
    </div>
  </div>
  );
};

export default Developer;