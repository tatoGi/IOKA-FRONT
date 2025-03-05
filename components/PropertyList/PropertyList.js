import React from "react";
import Image from "next/image";
import styles from "./PropertyList.module.css";
import { FiBed, FiSquare } from "react-icons/fi";
import { BiBath } from "react-icons/bi";

const PropertyList = () => {
  return (
    <div className={styles.propertyListSection}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <h2>New Developments for sale in Dubai</h2>
          <span className={styles.results}>20 Results</span>
        </div>

        <div className={styles.propertyGrid}>
          {/* Property Card */}
          <div className={styles.propertyCard}>
            <div className={styles.imageContainer}>
              <span className={styles.exclusiveTag}>Exclusive</span>
              <Image
                src=""
                alt="Affordable Urban House"
                width={500}
                height={300}
                objectFit="cover"
              />
            </div>
            <div className={styles.cardContent}>
              <h3>Affordable Urban House</h3>
              <p className={styles.location}>1423 San Pedro Fujairah</p>
              <div className={styles.features}>
                <span>3 Br</span>
                <span>3 Ba</span>
                <span>
                  <FiSquare /> 2300 Sq.Ft
                </span>
                <span>1 Gr</span>
              </div>
              <div className={styles.priceRow}>
                <span className={styles.price}>$1,250,000</span>
                <div className={styles.actions}>
                  <button className={styles.favoriteBtn}>♡</button>
                  <button className={styles.shareBtn}>↗</button>
                </div>
              </div>
            </div>
          </div>
          {/* Repeat property cards as needed */}
        </div>
      </div>
    </div>
  );
};

export default PropertyList;
