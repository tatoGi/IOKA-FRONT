import React, { useState, useRef, useEffect } from "react";
import styles from "../HomeBanner/HomeBanner.module.css";
import { LOCATIONS_API } from "../../routes/apiRoutes";
import ReactSlider from "react-slider";
import { useRouter } from "next/router"; // Add this import
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
  const [locations, setLocations] = useState([]); // State for storing locations
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const modalRef = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      if (modalContent === "Where" && locations.length === 0) {
        try {
          setLoadingLocations(true);
          setError(null);
          const response = await axios.get(LOCATIONS_API);

          setLocations(response.data); // Adjust based on your API response structure
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

  useEffect(() => {
    if (isModalOpen && (searchValues.size || searchValues.price)) {
      const resultsSection = document.getElementById("search-results");
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [isModalOpen, searchValues.size, searchValues.price]);

  const handleLocationSelect = (location) => {
    setSelectedLocations((prev) => {
      const isSelected = prev.some((loc) => loc.id === location.id);
      const updatedLocations = isSelected
        ? prev.filter((loc) => loc.id !== location.id)
        : [...prev, location];

      // Update searchValues.where immediately
      const locationNames = updatedLocations.map((loc) => loc.title).join(", ");
      setSearchValues((prev) => ({
        ...prev,
        where: locationNames
      }));

      return updatedLocations;
    });
  };
  const clearSelectedLocations = () => {
    setSearchValues((prev) => ({ ...prev, where: "" }));
    setSelectedLocations([]);
  };
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

  const handleTypeToggle = (type) => {
    setSelectedTypes((prev) => {
      if (prev.includes(type)) {
        // Remove type if already selected
        return prev.filter((t) => t !== type);
      } else {
        // Add type if not selected
        return [...prev, type];
      }
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    try {
      // Ensure we have at least one type selected
      if (selectedTypes.length === 0) {
        console.warn("No property types selected");
        return;
      }

      // Prepare query parameters
      const queryParams = {
        type: selectedTypes.map((type) => type.toLowerCase()).join(","), // Convert to lowercase and join with commas
        // Send locations as comma-separated string
        location: selectedLocations.length > 0 ? selectedLocations.map((loc) => loc.id).join(",") : "",
        // Include size parameters if they exist
        ...(searchValues.sizeMin && { sizeMin: searchValues.sizeMin }),
        ...(searchValues.sizeMax && { sizeMax: searchValues.sizeMax }),
        // Include price parameters if they exist
        ...(searchValues.priceMin && { priceMin: searchValues.priceMin }),
        ...(searchValues.priceMax && { priceMax: searchValues.priceMax }),
        // Include bathroom parameters if they exist
        ...(searchValues.bathMin && { bathMin: searchValues.bathMin }),
        ...(searchValues.bathMax && { bathMax: searchValues.bathMax }),
        currency: searchValues.priceCurrency,
        // Add flag to indicate OR search for filters
        matchAnyFilter: true
      };

      // Remove empty parameters except for location
      Object.keys(queryParams).forEach((key) => {
        if (
          key !== 'location' && // Don't remove location parameter
          (queryParams[key] === "" ||
          queryParams[key] === undefined ||
          (Array.isArray(queryParams[key]) && queryParams[key].length === 0))
        ) {
          delete queryParams[key];
        }
      });

      router.push(
        {
          pathname: "/homesearch",
          query: queryParams
        },
        undefined,
        { shallow: true }
      );
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  // Add this for debugging selected types
  useEffect(() => {
    console.log("Selected types:", selectedTypes);
  }, [selectedTypes]);

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
                placeholder="Search location"
                value={searchValues.where}
                onChange={handleInputChange}
                name="where"
              />
              {searchValues.where && (
                <button
                  className={styles.clear_button}
                  onClick={() => {
                    setSearchValues((prev) => ({ ...prev, where: "" }));
                    setSelectedLocations([]);
                  }}
                >
                  ×
                </button>
              )}
            </div>

            {loadingLocations ? (
              <div className={styles.loading}>Loading locations...</div>
            ) : error ? (
              <div className={styles.error}>{error}</div>
            ) : (
              <>
                <div className={styles.grid_wrapper}>
                  {locations.map((location) => {
                    const isSelected = selectedLocations.some(
                      (loc) => loc.id === location.id
                    );
                    return (
                      <div
                        className={`${styles.district_card} ${
                          isSelected ? styles.selected : ""
                        }`}
                        key={location.id}
                        onClick={() => handleLocationSelect(location)}
                      >
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
                        <div className={styles.district_name}>
                          <span>{location.title}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        );
      case "Size":
        return (
          <div className={styles["size-search"]}>
            <div className={styles.card}>
              <h2 className={styles.heading}>
                What should be the area of the apartment?
              </h2>

              {/* Dual-thumb slider for size */}
              <ReactSlider
                className={styles.dualSlider}
                thumbClassName={styles.dualThumb}
                trackClassName={styles.dualTrack}
                min={35}
                max={550}
                value={[
                  searchValues.sizeMin || 35,
                  searchValues.sizeMax || 550
                ]}
                onChange={handleSizeChange}
                pearling
                minDistance={35}
              />

              <div className={styles.inputs} style={{ marginBottom: "24px" }}>
                <input
                  type="number"
                  value={searchValues.sizeMin || ""}
                  onChange={(e) => {
                    const value = Math.max(
                      0,
                      Math.min(
                        parseInt(e.target.value) || 0,
                        searchValues.sizeMax || 550
                      )
                    );
                    setSearchValues((prev) => ({
                      ...prev,
                      sizeMin: value
                    }));
                  }}
                  name="sizeMin"
                  placeholder="35m²"
                  className={styles.input}
                />
                <input
                  type="number"
                  value={searchValues.sizeMax || ""}
                  onChange={(e) => {
                    const value = Math.min(
                      550,
                      Math.max(
                        parseInt(e.target.value) || 550,
                        searchValues.sizeMin || 35
                      )
                    );
                    setSearchValues((prev) => ({
                      ...prev,
                      sizeMax: value
                    }));
                  }}
                  name="sizeMax"
                  placeholder="550m²"
                  className={styles.input}
                />
              </div>

              <h3 className={styles.heading}>
                What should be the number of rooms?
              </h3>

              {/* Dual-thumb slider for bedrooms */}
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
                    const value = Math.max(
                      0,
                      Math.min(
                        parseInt(e.target.value) || 1,
                        searchValues.bathMax || 12
                      )
                    );
                    setSearchValues((prev) => ({
                      ...prev,
                      bathMin: value
                    }));
                  }}
                  name="bathMin"
                  placeholder="1"
                  className={styles.input}
                />
                <input
                  type="number"
                  value={searchValues.bathMax || ""}
                  onChange={(e) => {
                    const value = Math.min(
                      12,
                      Math.max(
                        parseInt(e.target.value) || 12,
                        searchValues.bathMin || 1
                      )
                    );
                    setSearchValues((prev) => ({
                      ...prev,
                      bathMax: value
                    }));
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
              <h2 className={styles.price_heading}>
                What should the price of the apartment be?
              </h2>

              {/* Dual-thumb price slider */}
              <ReactSlider
                className={styles.dualSlider}
                thumbClassName={styles.dualThumb}
                trackClassName={styles.dualTrack}
                min={0}
                max={10000000} // Adjust max price as needed
                value={[
                  searchValues.priceMin || 190000,
                  searchValues.priceMax || 500640000
                ]}
                onChange={(values) => {
                  setSearchValues((prev) => ({
                    ...prev,
                    priceMin: values[0],
                    priceMax: values[1]
                  }));
                }}
                pearling
                minDistance={100000} // Minimum price gap
              />

              <div className={styles.price_inputs}>
                <input
                  type="number"
                  value={searchValues.priceMin || ""}
                  onChange={(e) => {
                    const value = Math.max(
                      0,
                      Math.min(
                        parseInt(e.target.value.replace(/\D/g, "")) || 190000,
                        searchValues.priceMax || 500640000
                      )
                    );
                    setSearchValues((prev) => ({
                      ...prev,
                      priceMin: value
                    }));
                  }}
                  name="priceMin"
                  placeholder="190,000 $"
                  className={styles.input}
                />
                <input
                  type="number"
                  value={searchValues.priceMax || ""}
                  onChange={(e) => {
                    const value = Math.min(
                      10000000,
                      Math.max(
                        parseInt(e.target.value.replace(/\D/g, "")) ||
                          500640000,
                        searchValues.priceMin || 190000
                      )
                    );
                    setSearchValues((prev) => ({
                      ...prev,
                      priceMax: value
                    }));
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

  return (
    <div className={styles["banner-search"]}>
      <div className={styles["search-tabs"]}>
        <button
          className={`${styles.tab} ${
            selectedTypes.includes("OFFPLAN") ? styles.active : ""
          }`}
          onClick={() => handleTypeToggle("OFFPLAN")}
        >
          OFFPLAN
        </button>
        <button
          className={`${styles.tab} ${
            selectedTypes.includes("RESALE") ? styles.active : ""
          }`}
          onClick={() => handleTypeToggle("RESALE")}
        >
          RESALE
        </button>
        <button
          className={`${styles.tab} ${
            selectedTypes.includes("RENTAL") ? styles.active : ""
          }`}
          onClick={() => handleTypeToggle("RENTAL")}
        >
          RENTAL
        </button>
      </div>
      <form onSubmit={handleSearch}>
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
                value={
                  selectedLocations.length > 0
                    ? selectedLocations.map((loc) => loc.title).join(", ")
                    : ""
                }
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
                      }m²${
                        searchValues.bathMin
                          ? ` • ${searchValues.bathMin}-${searchValues.bathMax} rooms`
                          : ""
                      }`
                    : ""
                }
                readOnly
                className={styles.truncate_input}
              />
              {(searchValues.sizeMin ||
                searchValues.sizeMax ||
                searchValues.bathMin ||
                searchValues.bathMax) && (
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
          {modalVisible && (
            <div className={styles.modal_overlay} onClick={closeModal}>
              <div
                ref={modalRef}
                className={styles.modal_content}
                onClick={(e) => e.stopPropagation()} // This prevents modal clicks from closing it
              >
                {renderModalContent()}
                <div id="search-results">{/* Your results content here */}</div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default HomeBannerSearch;
