import React, { useState, useRef, useEffect } from "react";
import styles from "../HomeBanner/HomeBanner.module.css";

const HomeBannerSearch = () => {
  const [activeTab, setActiveTab] = useState("OFFPLAN");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [activeInput, setActiveInput] = useState(null);
  const [searchValues, setSearchValues] = useState({
    where: "",
    sizeMin: "",
    sizeMax: "",
    priceMin: "",
    priceMax: "",
    priceCurrency: "AED"
  });

  const modalRef = useRef();
  const districts = [
    "Al Safa",
    "Al Barari",
    "Al Barsha",
    "Al Furjan",
    "Al Ghadeer",
    "Al Jaddaf",
    "Alreeman",
    "Central Park",
    "Al Safa",
    "Al Barari",
    "Al Barsha",
    "Al Furjan",
    "Al Ghadeer",
    "Al Jaddaf",
    "Alreeman",
    "Central Park"
  ];
  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalVisible &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalVisible]);

  const openModal = (content) => {
    setModalContent(content);
    setModalVisible(true);
    setActiveInput(content.toLowerCase());
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalContent("");
    setActiveInput(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchValues((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = () => {
    console.log("Searching with:", {
      tab: activeTab,
      ...searchValues
    });
    closeModal();
  };

  const renderModalContent = () => {
    switch (modalContent) {
      case "Where":
        return (
          <div className={styles.location_search}>
            <h3>by location</h3>

            <div className={styles.input_wrapper}>
              <svg
                className={styles.search_icon}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="#A0AEC0"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35m1.17-5.17a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search district"
                value={searchValues.where}
                onChange={handleInputChange}
                name="where"
              />
              {searchValues.where && (
                <button
                  className={styles.clear_button}
                  onClick={() =>
                    setSearchValues((prev) => ({ ...prev, where: "" }))
                  }
                >
                  ×
                </button>
              )}
            </div>

            <div className={styles.grid_wrapper}>
              {districts.map((district, index) => (
                <div className={styles.district_card} key={`${district}-${index}`}>
                  <div className={styles.district_location}>
                    <svg
                      className={styles.pin_icon}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="#A0AEC0"
                        strokeWidth="2"
                        d="M12 21s6-5.686 6-10.5A6 6 0 0012 4a6 6 0 00-6 6.5C6 15.314 12 21 12 21z"
                      />
                      <circle cx="12" cy="10" r="2" fill="#A0AEC0" />
                    </svg>
                  </div>
                  <div className={styles.district_name}>{district}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case "Size":
        return (
          <div className={styles["size-search"]}>
            <div className={styles.card}>
              <h2 className={styles.heading}>
                What should be the area of the apartment?
              </h2>
              <input
                type="range"
                min={0}
                max={1000}
                className={styles.slider}
                // You'll need to bind value and onChange as needed
              />

              <label className={styles.label}>Meter square</label>
              <div className={styles.inputs} style={{ marginBottom: "24px" }}>
                <input
                  type="number"
                  value={searchValues.sizeMin}
                  onChange={handleInputChange}
                  name="sizeMin"
                  placeholder=" 35m²"
                  className={styles.input}
                />
                <input
                  type="number"
                  value={searchValues.sizeMax}
                  onChange={handleInputChange}
                  name="sizeMax"
                  placeholder="550m²"
                  className={styles.input}
                />
              </div>
              <h3 className={styles.heading}>
                What should be the number of rooms?
              </h3>
              <input
                type="range"
                min={0}
                max={1000}
                className={styles.slider}
                // You'll need to bind value and onChange as needed
              />
               <label className={styles.label}>Bedrooms</label>
              <div className={styles.inputs}>
                <input
                  type="number"
                  value={searchValues.bathMin}
                  onChange={handleInputChange}
                  name="bathMin"
                  placeholder=" 1"
                  className={styles.input}
                />
                <input
                  type="number"
                  value={searchValues.bathMax}
                  onChange={handleInputChange}
                  name="bathMax"
                  placeholder="12"
                  className={styles.input}
                />
              </div>
            </div>
          </div>
        );
      case "Price":
        return (
          <div className={styles["price-search"]}>
           <div className={styles.price_card}>
              <h2 className={styles.price_heading}>
              What should the price of the apartment be?
              </h2>
              <input
                type="range"
                min={0}
                max={1000}
                className={styles.price_slider}
                // You'll need to bind value and onChange as needed
              />

              <div className={styles.price_inputs}>
                <input
                  type="number"
                  value={searchValues.priceMin}
                  onChange={handleInputChange}
                  name="priceMin"
                  placeholder="190 000 $"
                  className={styles.input}
                />
                <input
                  type="number"
                  value={searchValues.priceMax}
                  onChange={handleInputChange}
                  name="priceMax"
                  placeholder="500 640 000 $"
                  className={styles.input}
                />
              </div>
              
             
            </div>
          </div>
        );
      default:
        return null;
    }
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
      <div
        className={`${styles["search-container"]} ${
          activeInput ? styles.active : ""
        }`}
      >
        <div className={styles["search-inputs"]}>
          <div
            className={`${styles.where} ${
              activeInput === "where" ? styles.active : ""
            }`}
            onClick={() => openModal("Where")}
          >
            <input
              type="text"
              placeholder="Where"
              value={searchValues.where || ""}
              readOnly
            />
          </div>
          <div className={styles.line}></div>
          <div
            className={`${styles.size} ${
              activeInput === "size" ? styles.active : ""
            }`}
            onClick={() => openModal("Size")}
          >
            <input
              type="text"
              placeholder="Size"
              value={
                searchValues.sizeMin || searchValues.sizeMax
                  ? `${searchValues.sizeMin || "0"} - ${
                      searchValues.sizeMax || "∞"
                    } m²`
                  : ""
              }
              readOnly
            />
          </div>
          <div className={styles.line}></div>
          <div
            className={`${styles["price-input-container"]} ${
              activeInput === "price" ? styles.active : ""
            }`}
            onClick={() => openModal("Price")}
          >
            <input
              type="text"
              placeholder="Price"
              value={
                searchValues.priceMin || searchValues.priceMax
                  ? `${searchValues.priceMin || "0"} - ${
                      searchValues.priceMax || "∞"
                    } ${searchValues.priceCurrency}`
                  : ""
              }
              readOnly
            />
            <button
              className={styles["search-button"]}
              onClick={(e) => {
                e.stopPropagation();
                handleSearch();
              }}
            >
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
        {modalVisible && (
        <div className={styles.modal_overlay} onClick={closeModal}>
          <div
            ref={modalRef}
            className={styles.modal_content}
            onClick={(e) => e.stopPropagation()} // This prevents modal clicks from closing it
          >
            {renderModalContent()}
          </div>
        </div>
      )}
      </div>
   
    </div>
  );
};

export default HomeBannerSearch;
