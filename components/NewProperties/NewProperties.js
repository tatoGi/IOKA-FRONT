import React from "react";
import styles from "./NewProperties.module.css";
import Image from "next/image";
import DeveloperImage from "../../assets/img/developerimg.png";

const NewProperties = () => {
  return (
    <div className={styles.newProperties}>
      <div className={`container ${styles.container}`}>
       

        <div className={styles.propertyCard}>
          <div className={styles.propertyCardTitle}>
            NEW PROPERTIES IN DUBAI
            <div className={styles.filterButtons}>
          <div className={styles.buttonGroup}>
            <button className={styles.active}>OFF PLAN</button>
            <button>RESALE</button>
            <button>RENTAL</button>
          </div>
        </div>
          </div>
         
          <div className={styles.propertyContent}>
            <div className={styles.imageContainer}>
              <Image
                src={DeveloperImage}
                alt="Adress Residences at DHE"
                width={1200}
                height={600}
                className={styles.propertyImage}
                priority
              />
            </div>

            <div className={styles.propertyInfo}>
              <ul className={styles.features}>
                <li>Premium apartments with stunning views</li>
                <li>Prime location Dubai Hills Estate</li>
                <li>Adress brand luxury and sophistication</li>
                <li>World-class amenities</li>
                <li>Modern design and finishes</li>
                <li>Convenient access to major attractions</li>
              </ul>
            </div>
          </div>

          <div className={styles.propertyDetails}>
            <div className={styles.leftContent}>
              <h3 className={styles.propertyName}>Adress Residences at DHE</h3>
              <p className={styles.propertyType}>
                1 - 3 Bedroom Spacious Apartment
              </p>
              <p className={styles.price}>AED 1.930.000</p>
            </div>

            <div className={styles.rightContent}>
              <button className={styles.seeMore}>SEE MORE</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProperties;