import React, { useState } from "react";
import styles from "../HomeBanner/HomeBanner.module.css";

const HomeBannerSearch = () => {
  const [activeTab, setActiveTab] = useState("OFFPLAN");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const openModal = (content) => {
    setModalContent(content);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalContent("");
  };

  return (
    <div className={styles["banner-search"]}>
      <div className={styles["search-tabs"]}>
        <button
          className={`${styles.tab} ${
            activeTab === "OFFPLAN" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("OFFPLAN")}
        >
          OFFPLAN
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "RESALE" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("RESALE")}
        >
          RESALE
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "RENTAL" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("RENTAL")}
        >
          RENTAL
        </button>
      </div>
      <div className={styles["search-container"]}>
        <div className={styles["search-inputs"]}>
          <div className={styles.where} onClick={() => openModal("Where")}>
            <input type="text" placeholder="Where" readOnly />
          </div>
          <div className={styles.size} onClick={() => openModal("Size")}>
            <input type="text" placeholder="Size" readOnly />
          </div>
          <div
            className={styles["price-input-container"]}
            onClick={() => openModal("Price")}
          >
            <input type="text" placeholder="Price" readOnly />
            <button className={styles["search-button"]}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
      {modalVisible && (
        <div className={styles.modal}>
          <div className={styles["modal-content"]}>
            <button className={styles["close-button"]} onClick={closeModal}>
              &times;
            </button>
            <h2>{modalContent}</h2>
            <p>Search options for {modalContent} in {activeTab}.</p>
            {/* Add search options here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeBannerSearch;
