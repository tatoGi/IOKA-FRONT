import React from "react";
import styles from "./SearchSection.module.css";
import { FiSearch } from "react-icons/fi";
import Image from "next/image";
import filterVector from "../../assets/img/filter.svg";

const SearchSection = () => {
  return (
    <div className={styles.searchSection}>
      <div className={styles.container}>
        <div className={styles.searchBar}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="City, Building or community"
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filterButtons}>
          <button
            className={styles.filterBtn}
            style={{ width: "158px", height: "40px" }}
          >
            Property type
            <svg
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className={styles.filterBtn}
            style={{ width: "89px", height: "40px" }}
          >
            Price
            <svg
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className={styles.filterBtn}
            style={{ width: "132px", height: "40px" }}
          >
            Bedrooms
            <svg
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className={styles.filterBtn}
            style={{ width: "118px", height: "40px" }}
          >
            Listed as
            <svg
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className={styles.moreFiltersBtn}
            style={{ width: "143px", height: "40px" }}
          >
            More Filters
            <Image src={filterVector} alt="Filter" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
