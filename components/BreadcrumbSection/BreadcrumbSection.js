import React from "react";
import Link from "next/link";
import styles from "./BreadcrumbSection.module.css";

const BreadcrumbSection = ({ currentPage }) => {
  return (
    <div className={styles.breadcrumbContainer}>
      <div className={styles.breadcrumbContent}>
        <Link href="/" className={styles.breadcrumbLink}>
          Home
        </Link>
        <span className={styles.separator}>/</span>
        <span className={styles.currentPage}>{currentPage}</span>
      </div>
    </div>
  );
};

export default BreadcrumbSection;
