import React, { useState, useRef, useEffect } from "react";
import styles from "../HomeBanner/HomeBanner.module.css";
import { LOCATIONS_API } from "../../routes/apiRoutes";
import ReactSlider from "react-slider";
import { useRouter } from "next/router";
import axios from "axios";

const HomeBannerSearch = () => {
  const router = useRouter();
  const [selectedTypes, setSelectedTypes] = useState(["OFFPLAN"]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [activeInput, setActiveInput] = useState(null);
  const [searchValues, setSearchValues] = useState({
    where: "",
    sizeMin: "",
    sizeMax: "",
    priceMin: "",
    priceMax: "",
    priceCurrency: "AED",
    bathMin: "",
    bathMax: ""
  });
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const modalRef = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch locations when Where modal opens
  useEffect(() => {
    const fetchLocations = async () => {
      if (modalContent === "Where" && locations.length === 0) {
        try {
          setLoadingLocations(true);
          setError(null);
          const response = await axios.get(LOCATIONS_API);
          setLocations(response.data);
          setFilteredLocations(response.data);
        } catch (err) {
          setError("Failed to fetch locations");
          console.error("Error fetching locations:", err);
        } finally {
          setLoadingLocations(false);
        }
      }
    };

    fetchLocations();
  }, [modalContent]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalVisible && modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalVisible]);

  // Scroll to results when filters are applied
  useEffect(() => {
    if (isModalOpen && (searchValues.size || searchValues.price)) {
      const resultsSection = document.getElementById("search-results");
      if (resultsSection) resultsSection.scrollIntoView({ behavior: "smooth" });
    }
  }, [isModalOpen, searchValues.size, searchValues.price]);

  // Location handlers
  const handleLocationSelect = (location) => {
    setSelectedLocations((prev) => {
      const isSelected = prev.some((loc) => loc.id === location.id);
      const updatedLocations = isSelected
        ? prev.filter((loc) => loc.id !== location.id)
        : [...prev, location];

      setSearchValues((prev) => ({
        ...prev,
        where: updatedLocations.map((loc) => loc.title).join(", ")
      }));

      return updatedLocations;
    });
  };

  const clearSelectedLocations = () => {
    setSearchValues((prev) => ({ ...prev, where: "" }));
    setSelectedLocations([]);
  };

  // Slider handlers
  const handleSizeChange = (values) => {
    setSearchValues((prev) => ({
      ...prev,
      sizeMin: values[0],
      sizeMax: values[1]
    }));
  };

  const handleRoomChange = (values) => {
    setSearchValues((prev) => ({
      ...prev,
      bathMin: values[0],
      bathMax: values[1]
    }));
  };

  // Modal handlers
  const openModal = (content) => {
    if (isMobile) {
      setModalContent(""); // Clear specific content to show all inputs
      setModalVisible(true);
      setIsModalOpen(true);
    } else {
      setModalContent(content);
      setModalVisible(true);
      setActiveInput(content.toLowerCase());
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalContent("");
    setActiveInput(null);
    setIsModalOpen(false);
  };

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchValues((prev) => ({
      ...prev,
      [name]: value
    }));

    // Filter locations when searching in the "where" input
    if (name === "where") {
      const filtered = locations.filter(location =>
        location.title.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
  };

  // Property type toggle
  const handleTypeToggle = (type) => {
    setSelectedTypes((prev) => 
      prev.includes(type) 
        ? prev.filter((t) => t !== type) 
        : [...prev, type]
    );
  };

  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    try {
      if (selectedTypes.length === 0) {
        console.warn("No property types selected");
        return;
      }

      const queryParams = {
        type: selectedTypes.map((type) => type.toLowerCase()).join(","),
        location: selectedLocations.length > 0 
          ? selectedLocations.map((loc) => loc.id).join(",") 
          : "",
        ...(searchValues.sizeMin && { sizeMin: searchValues.sizeMin }),
        ...(searchValues.sizeMax && { sizeMax: searchValues.sizeMax }),
        ...(searchValues.priceMin && { priceMin: searchValues.priceMin }),
        ...(searchValues.priceMax && { priceMax: searchValues.priceMax }),
        ...(searchValues.bathMin && { bathMin: searchValues.bathMin }),
        ...(searchValues.bathMax && { bathMax: searchValues.bathMax }),
        currency: searchValues.priceCurrency,
        matchAnyFilter: true
      };

      // Clean empty params
      Object.keys(queryParams).forEach((key) => {
        if (key !== 'location' && key !== 'type' && 
            (queryParams[key] === "" || 
             queryParams[key] === undefined || 
             (Array.isArray(queryParams[key]) && queryParams[key].length === 0))) {
          delete queryParams[key];
        }
      });

      // Add empty flag if no search criteria are provided
      const hasSearchCriteria = selectedLocations.length > 0 || 
        searchValues.sizeMin || searchValues.sizeMax || 
        searchValues.priceMin || searchValues.priceMax || 
        searchValues.bathMin || searchValues.bathMax;

      if (!hasSearchCriteria) {
        queryParams.empty = true;
      }

      router.push({
        pathname: "/homesearch",
        query: queryParams
      }, undefined, { shallow: true });
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  // Desktop modal content
  const renderModalContent = () => {
    switch (modalContent) {
      case "Where":
        return (
          <div className={styles.location_section}>
            <h3 className={styles.location_title}>by location</h3>
            <div className={styles.search_input_wrapper}>
              <div className={styles.search_icon_wrapper}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search district"
                value={searchValues.where}
                onChange={handleInputChange}
                name="where"
                className={styles.search_input}
              />
              {searchValues.where && (
                <button
                  className={styles.clear_input_button}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchValues((prev) => ({ ...prev, where: "" }));
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
            </div>
            
            <div className={styles.location_cards}>
              {filteredLocations.map((location) => (
                <div
                  key={location.id}
                  className={`${styles.location_card} ${
                    selectedLocations.some((loc) => loc.id === location.id) ? styles.selected : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLocationSelect(location);
                  }}
                >
                  <div className={styles.location_icon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 22C14 18 20 15.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 15.4183 10 18 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className={styles.location_name}>{location.title}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case "Size":
        return (
          <div className={styles["size-search"]}>
            <div className={styles.card}>
              <h2 className={styles.heading}>What should be the area of the apartment?</h2>
              <ReactSlider
                className={styles.dualSlider}
                thumbClassName={styles.dualThumb}
                trackClassName={styles.dualTrack}
                min={35}
                max={550}
                value={[searchValues.sizeMin || 35, searchValues.sizeMax || 550]}
                onChange={handleSizeChange}
                pearling
                minDistance={35}
              />
              <div className={styles.inputs} style={{ marginBottom: "24px" }}>
                <input
                  type="number"
                  value={searchValues.sizeMin || ""}
                  onChange={(e) => {
                    const value = Math.max(0, Math.min(parseInt(e.target.value) || 0, searchValues.sizeMax || 550));
                    setSearchValues((prev) => ({ ...prev, sizeMin: value }));
                  }}
                  name="sizeMin"
                  placeholder="35m²"
                  className={styles.input}
                />
                <input
                  type="number"
                  value={searchValues.sizeMax || ""}
                  onChange={(e) => {
                    const value = Math.min(550, Math.max(parseInt(e.target.value) || 550, searchValues.sizeMin || 35));
                    setSearchValues((prev) => ({ ...prev, sizeMax: value }));
                  }}
                  name="sizeMax"
                  placeholder="550m²"
                  className={styles.input}
                />
              </div>

              <h3 className={styles.heading}>What should be the number of rooms?</h3>
              <ReactSlider
                className={styles.dualSlider}
                thumbClassName={styles.dualThumb}
                trackClassName={styles.dualTrack}
                min={0}
                max={12}
                value={[searchValues.bathMin || 1, searchValues.bathMax || 12]}
                onChange={handleRoomChange}
                pearling
                minDistance={1}
              />
              <div className={styles.inputs}>
                <input
                  type="number"
                  value={searchValues.bathMin || ""}
                  onChange={(e) => {
                    const value = Math.max(0, Math.min(parseInt(e.target.value) || 1, searchValues.bathMax || 12));
                    setSearchValues((prev) => ({ ...prev, bathMin: value }));
                  }}
                  name="bathMin"
                  placeholder="1"
                  className={styles.input}
                />
                <input
                  type="number"
                  value={searchValues.bathMax || ""}
                  onChange={(e) => {
                    const value = Math.min(12, Math.max(parseInt(e.target.value) || 12, searchValues.bathMin || 1));
                    setSearchValues((prev) => ({ ...prev, bathMax: value }));
                  }}
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
              <h2 className={styles.price_heading}>What should the price of the apartment be?</h2>
              <ReactSlider
                className={styles.dualSlider}
                thumbClassName={styles.dualThumb}
                trackClassName={styles.dualTrack}
                min={0}
                max={10000000}
                value={[searchValues.priceMin || 190000, searchValues.priceMax || 500640000]}
                onChange={(values) => {
                  setSearchValues((prev) => ({
                    ...prev,
                    priceMin: values[0],
                    priceMax: values[1]
                  }));
                }}
                pearling
                minDistance={100000}
              />
              <div className={styles.price_inputs}>
                <input
                  type="number"
                  value={searchValues.priceMin || ""}
                  onChange={(e) => {
                    const value = Math.max(0, Math.min(parseInt(e.target.value.replace(/\D/g, "")) || 190000, searchValues.priceMax || 500640000));
                    setSearchValues((prev) => ({ ...prev, priceMin: value }));
                  }}
                  name="priceMin"
                  placeholder="190,000 $"
                  className={styles.input}
                />
                <input
                  type="number"
                  value={searchValues.priceMax || ""}
                  onChange={(e) => {
                    const value = Math.min(10000000, Math.max(parseInt(e.target.value.replace(/\D/g, "")) || 500640000, searchValues.priceMin || 190000));
                    setSearchValues((prev) => ({ ...prev, priceMax: value }));
                  }}
                  name="priceMax"
                  placeholder="500,640,000 $"
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

  // Mobile modal content
  const renderModalContentMobile = () => {
    const handleCloseModal = () => {
      setModalContent("");
      setModalVisible(false);
    };

    const handleInputClick = (inputType) => {
      setModalContent(inputType);
    };

    return (
      <div className={styles.modal_container}>
        <div className={styles.modal_content_wrapper}>
          <button 
            className={styles.close_modal_button} 
            onClick={handleCloseModal}
            aria-label="Close modal"
          >
            ×
          </button>

          <div className={styles.mobile_search_inputs}>
            {/* Where Input */}
            <div 
              className={`${styles.mobile_input_field} ${modalContent === "Where" ? styles.expanded : ""}`}
              onClick={() => handleInputClick("Where")}
            >
              {modalContent === "Where" ? (
                <div className={styles.location_section}>
                  <h3 className={styles.location_title}>by location</h3>
                  <div className={styles.search_input_wrapper}>
                    <div className={styles.search_icon_wrapper}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search district"
                      value={searchValues.where}
                      onChange={handleInputChange}
                      name="where"
                      className={styles.search_input}
                    />
                    {searchValues.where && (
                      <button
                        className={styles.clear_input_button}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSearchValues((prev) => ({ ...prev, where: "" }));
                        }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  <div className={styles.location_cards}>
                    {filteredLocations.map((location) => (
                      <div
                        key={location.id}
                        className={`${styles.location_card} ${
                          selectedLocations.some((loc) => loc.id === location.id) ? styles.selected : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLocationSelect(location);
                        }}
                      >
                        <div className={styles.location_icon}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 22C14 18 20 15.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 15.4183 10 18 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span className={styles.location_name}>{location.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <span className={styles.label}>Where</span>
                  <span className={styles.value}>
                    {selectedLocations.length > 0 
                      ? selectedLocations.map(loc => loc.title).join(", ")
                      : "All island"}
                  </span>
                </>
              )}
            </div>

            {/* Price Input */}
            <div 
              className={`${styles.mobile_input_field} ${modalContent === "Price" ? styles.expanded : ""}`}
              onClick={() => handleInputClick("Price")}
            >
              {modalContent === "Price" ? (
                <div className={styles.price_section}>
                  <h2 className={styles.price_heading}>What should the price of the apartment be?</h2>
                  <ReactSlider
                    className={styles.dualSlider}
                    thumbClassName={styles.dualThumb}
                    trackClassName={styles.dualTrack}
                    min={0}
                    max={10000000}
                    value={[searchValues.priceMin || 190000, searchValues.priceMax || 500640000]}
                    onChange={(values) => {
                      setSearchValues((prev) => ({
                        ...prev,
                        priceMin: values[0],
                        priceMax: values[1]
                      }));
                    }}
                    pearling
                    minDistance={100000}
                  />
                  <div className={styles.price_inputs}>
                    <input
                      type="number"
                      value={searchValues.priceMin || ""}
                      onChange={(e) => {
                        const value = Math.max(0, Math.min(parseInt(e.target.value.replace(/\D/g, "")) || 190000, searchValues.priceMax || 500640000));
                        setSearchValues((prev) => ({ ...prev, priceMin: value }));
                      }}
                      name="priceMin"
                      placeholder="190,000 $"
                      className={styles.input}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <input
                      type="number"
                      value={searchValues.priceMax || ""}
                      onChange={(e) => {
                        const value = Math.min(10000000, Math.max(parseInt(e.target.value.replace(/\D/g, "")) || 500640000, searchValues.priceMin || 190000));
                        setSearchValues((prev) => ({ ...prev, priceMax: value }));
                      }}
                      name="priceMax"
                      placeholder="500,640,000 $"
                      className={styles.input}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <span className={styles.label}>Price</span>
                  <span className={styles.value}>
                    {searchValues.priceMin && searchValues.priceMax
                      ? `${searchValues.priceMin.toLocaleString()}-${searchValues.priceMax.toLocaleString()}`
                      : "50000-120000"}
                  </span>
                </>
              )}
            </div>

            {/* Size Input */}
            <div 
              className={`${styles.mobile_input_field} ${modalContent === "Size" ? styles.expanded : ""}`}
              onClick={() => handleInputClick("Size")}
            >
              {modalContent === "Size" ? (
                <div className={styles.size_section}>
                  <h2 className={styles.heading}>What should be the area of the apartment?</h2>
                  <ReactSlider
                    className={styles.dualSlider}
                    thumbClassName={styles.dualThumb}
                    trackClassName={styles.dualTrack}
                    min={35}
                    max={550}
                    value={[searchValues.sizeMin || 35, searchValues.sizeMax || 550]}
                    onChange={handleSizeChange}
                    pearling
                    minDistance={35}
                  />
                  <div className={styles.inputs}>
                    <input
                      type="number"
                      value={searchValues.sizeMin || ""}
                      onChange={(e) => {
                        const value = Math.max(0, Math.min(parseInt(e.target.value) || 0, searchValues.sizeMax || 550));
                        setSearchValues((prev) => ({ ...prev, sizeMin: value }));
                      }}
                      name="sizeMin"
                      placeholder="35m²"
                      className={styles.input}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <input
                      type="number"
                      value={searchValues.sizeMax || ""}
                      onChange={(e) => {
                        const value = Math.min(550, Math.max(parseInt(e.target.value) || 550, searchValues.sizeMin || 35));
                        setSearchValues((prev) => ({ ...prev, sizeMax: value }));
                      }}
                      name="sizeMax"
                      placeholder="550m²"
                      className={styles.input}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  <h3 className={styles.heading}>What should be the number of rooms?</h3>
                  <ReactSlider
                    className={styles.dualSlider}
                    thumbClassName={styles.dualThumb}
                    trackClassName={styles.dualTrack}
                    min={0}
                    max={12}
                    value={[searchValues.bathMin || 1, searchValues.bathMax || 12]}
                    onChange={handleRoomChange}
                    pearling
                    minDistance={1}
                  />
                  <div className={styles.inputs}>
                    <input
                      type="number"
                      value={searchValues.bathMin || ""}
                      onChange={(e) => {
                        const value = Math.max(0, Math.min(parseInt(e.target.value) || 1, searchValues.bathMax || 12));
                        setSearchValues((prev) => ({ ...prev, bathMin: value }));
                      }}
                      name="bathMin"
                      placeholder="1"
                      className={styles.input}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <input
                      type="number"
                      value={searchValues.bathMax || ""}
                      onChange={(e) => {
                        const value = Math.min(12, Math.max(parseInt(e.target.value) || 12, searchValues.bathMin || 1));
                        setSearchValues((prev) => ({ ...prev, bathMax: value }));
                      }}
                      name="bathMax"
                      placeholder="12"
                      className={styles.input}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <span className={styles.label}>Size</span>
                  <span className={styles.value}>
                    {searchValues.sizeMin && searchValues.sizeMax
                      ? `${searchValues.sizeMin}-${searchValues.sizeMax} m², ${searchValues.bathMin || 1}-${searchValues.bathMax || 12}`
                      : "35-550 m2, 1-12"}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className={styles.mobile_actions}>
            <button 
              className={styles.clear_all_button}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Clear all search values
                setSearchValues({
                  where: "",
                  sizeMin: "",
                  sizeMax: "",
                  priceMin: "",
                  priceMax: "",
                  priceCurrency: "AED",
                  bathMin: "",
                  bathMax: ""
                });
                // Clear selected locations
                setSelectedLocations([]);
                // Close expanded input
                setModalContent("");
              }}
            >
              Clear All
            </button>
            <button 
              type="button"
              className={styles.search_button}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSearch(e);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
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
              Search
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles["banner-search"]}>
      <div className={styles["search-tabs"]}>
        <button
          className={`${styles.tab} ${selectedTypes.includes("OFFPLAN") ? styles.active : ""}`}
          onClick={() => handleTypeToggle("OFFPLAN")}
        >
          OFFPLAN
        </button>
        <button
          className={`${styles.tab} ${selectedTypes.includes("RESALE") ? styles.active : ""}`}
          onClick={() => handleTypeToggle("RESALE")}
        >
          RESALE
        </button>
        <button
          className={`${styles.tab} ${selectedTypes.includes("RENTAL") ? styles.active : ""}`}
          onClick={() => handleTypeToggle("RENTAL")}
        >
          RENTAL
        </button>
      </div>
      <form onSubmit={handleSearch}>
        <span className={styles.search_title}>Search type of apartment</span>
        
        <div className={`${styles["search-container"]} ${activeInput ? styles.active : ""}`}>
          <div className={styles["search-inputs"]}>
            <div
              className={`${styles.where} ${activeInput === "where" ? styles.active : ""}`}
              onClick={() => openModal("Where")}
            >
              <input
                type="text"
                placeholder="Where"
                value={selectedLocations.length > 0 ? selectedLocations.map((loc) => loc.title).join(", ") : ""}
                readOnly
                className={styles.truncate_input}
              />
              {selectedLocations.length > 0 && (
                <button
                  className={styles.clear_button}
                  onClick={(e) => {
                    e.stopPropagation();
                    clearSelectedLocations();
                  }}
                >
                  ×
                </button>
              )}
            </div>
            <div className={styles.line}></div>
            <div
              className={`${styles.size} ${activeInput === "size" ? styles.active : ""}`}
              onClick={() => openModal("Size")}
            >
              <input
                type="text"
                placeholder="Size"
                value={
                  searchValues.sizeMin || searchValues.sizeMax
                    ? `${searchValues.sizeMin || "0"} - ${searchValues.sizeMax || "∞"}m²${
                        searchValues.bathMin ? ` • ${searchValues.bathMin}-${searchValues.bathMax} rooms` : ""
                      }`
                    : ""
                }
                readOnly
                className={styles.truncate_input}
              />
              {(searchValues.sizeMin || searchValues.sizeMax || searchValues.bathMin || searchValues.bathMax) && (
                <button
                  className={styles.clear_button}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchValues((prev) => ({
                      ...prev,
                      sizeMin: "",
                      sizeMax: "",
                      bathMin: "",
                      bathMax: ""
                    }));
                  }}
                >
                  ×
                </button>
              )}
            </div>
            <div className={styles.line}></div>
            <div
              className={`${styles["price-input-container"]} ${activeInput === "price" ? styles.active : ""}`}
              onClick={() => openModal("Price")}
            >
              <input
                type="text"
                placeholder="Price"
                value={
                  searchValues.priceMin || searchValues.priceMax
                    ? `${
                        searchValues.priceMin
                          ? Number(searchValues.priceMin).toLocaleString()
                          : "0"
                      } - ${
                        searchValues.priceMax
                          ? Number(searchValues.priceMax).toLocaleString()
                          : "∞"
                      } ${searchValues.priceCurrency}`
                    : ""
                }
                readOnly
                className={styles.truncate_input}
              />
              {(searchValues.priceMin || searchValues.priceMax) && (
                <button
                  className={styles.clear_button}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchValues((prev) => ({
                      ...prev,
                      priceMin: "",
                      priceMax: ""
                    }));
                  }}
                >
                  ×
                </button>
              )}
            </div>
           
          </div>
          
          {modalVisible && (
            <div className={styles.modal_overlay} onClick={closeModal}>
              <div
                ref={modalRef}
                className={styles.modal_content}
                onClick={(e) => e.stopPropagation()}
              >
                {isMobile ? renderModalContentMobile() : renderModalContent()}
                <div id="search-results"></div>
              </div>
            </div>
          )}
           <button
              type="submit"
              className={styles["search-button"]}
              onClick={(e) => {
                e.preventDefault();
                handleSearch(e);
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
      </form>
    </div>
  );
};

export default HomeBannerSearch;