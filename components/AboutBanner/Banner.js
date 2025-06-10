import React from "react";
import styles from './Banner.module.css';


const Banner = ({ title, description }) => {
  return (
    <div className={styles.banner}>
      <div className={styles.container}>
        <div className={styles.bannerContent}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
