import React, { useState } from "react";
import styles from "./Developer.module.css";
import Image from "next/image";
import DeveloperImage from "../../assets/img/developerimg.png";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPhone,
  FaWhatsapp
} from "react-icons/fa";
import { useRouter } from "next/router";

const Developer = () => {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Sample images array for the slider
  const images = [DeveloperImage, DeveloperImage, DeveloperImage]; // Add more images as needed

  const developerCards = Array(6).fill({
    images: images,
    aboutCompany: {
      title: "About Company",
      description: [
        "As a brokerage rooted in one of the world's most iconic cities, we pride ourselves on clarity, efficiency, and an unwavering commitment to client satisfaction"
      ]
    },
    topCommunities: [
      "Dubai Hills Estate",
      "Arabian Ranches 3",
      "The Valley",
      "Dubai Creek Harbour",
      "Emaar Beachfront"
    ]
  });

  const nextImage = (cardIndex) => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (cardIndex) => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleSeeMore = (cardIndex) => {
    router.push(`/developer/${cardIndex}`);
  };

  return (
    <div className={styles.developerSection}>
      <div className="container-fluid">
        <div className={styles.sectionHeader}>
          <div></div> {/* Empty div for flex spacing */}
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search developers..."
              className={styles.searchInput}
            />
            <button className={styles.searchButton}>Search</button>
          </div>
        </div>
        <div className="row g-4">
          {developerCards.map((card, cardIndex) => (
            <div key={cardIndex} className="col-lg-6 mb-4">
              <div className={styles.card}>
                <div className={styles.imageWrapper}>
                  <button
                    className={`${styles.navButton} ${styles.prevButton}`}
                    onClick={() => prevImage(cardIndex)}
                  >
                    <FaChevronLeft size={20} />
                  </button>
                  <Image
                    src={card.images[currentImageIndex]}
                    alt="Property"
                    width={600}
                    height={400}
                    className={styles.propertyImage}
                  />
                  <button
                    className={`${styles.navButton} ${styles.nextButton}`}
                    onClick={() => nextImage(cardIndex)}
                  >
                    <FaChevronRight size={20} />
                  </button>
                </div>

                <div className={styles.contentSection}>
                  <h2>{card.aboutCompany.title}</h2>
                  {card.aboutCompany.description.map((paragraph, index) => (
                    <p key={index} className={styles.description}>
                      {paragraph}
                    </p>
                  ))}

                  <div className={styles.communitiesSection}>
                    <h3>Top Communities</h3>
                    <div className={styles.communityTags}>
                      {card.topCommunities.map((community, index) => (
                        <button key={index} className={styles.communityTag}>
                          {community}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.bottomActions}>
                    <div className={styles.actionButtons}>
                      <button className={styles.callButton}>
                        <FaPhone size={16} style={{ marginRight: "8px" }} />
                        <span>Call</span>
                      </button>
                      <button className={styles.whatsappButton}>
                        <FaWhatsapp size={16} style={{ marginRight: "8px" }} />
                        <span>WhatsApp</span>
                      </button>
                      <div className={styles.seeMore}>
                        <button
                          className={styles.seeMoreButton}
                          onClick={() => handleSeeMore(cardIndex)}
                        >
                          See More
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Developer;
