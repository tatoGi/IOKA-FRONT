import React, { useState, useEffect, useCallback } from "react";
import styles from "./SearchSection.module.css";
import { FiSearch } from "react-icons/fi";
import Image from "next/image";
import filterVector from "../../assets/img/filter.svg";
import { LOCATION_SEARCH_API } from "@/routes/apiRoutes";

const SearchSection = ({ onFilterChange, filterOptions, showPricePopup, setShowPricePopup, showSqFtPopup, setShowSqFtPopup, currentFilters }) => {
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      document.body.classList.add('ios-device');
    }
  }, []);

  const [filters, setFilters] = useState({
    propertyType: "",
    price: currentFilters?.price || "",
    bedrooms: "",
    bathrooms: "",
    sqFt: currentFilters?.sqFt || "",
    searchQuery: "",
  });

  // Update filters when currentFilters changes
  useEffect(() => {
    if (currentFilters) {
      setFilters(prev => ({
        ...prev,
        price: currentFilters.price || "",
        sqFt: currentFilters.sqFt || ""
      }));
    }
  }, [currentFilters]);

  const [matchingLocations, setMatchingLocations] = useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const closeAllPopups = () => {
    setShowPricePopup(false);
    setShowSqFtPopup(false);
  };

  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const handleFilterChange = useCallback(
    debounce(async (field, value) => {
      const updatedFilters = { ...filters, [field]: value };
      setFilters(updatedFilters);
      onFilterChange(updatedFilters);
    }, 500),
    [filters, onFilterChange]
  );

  const clearFilter = (field) => {
    setFilters(prev => ({ ...prev, [field]: "" }));
    handleFilterChange(field, "");
  };

  const handleRangeApply = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    onFilterChange({ [field]: value });
  };

  const formatNumber = (num) => {
    if (!num) return '';
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatRangeDisplay = (value, isPrice = false) => {
    if (!value) return "";
    const [min, max] = value.split("-");
    
    if (min && max) {
      if (isPrice) {
        return `$${formatNumber(min)} - $${formatNumber(max)}`;
      }
      return `${formatNumber(min)} - ${formatNumber(max)}`;
    }
    if (min) {
      if (isPrice) {
        return `From $${formatNumber(min)}`;
      }
      return `From ${formatNumber(min)}`;
    }
    if (max) {
      if (isPrice) {
        return `Up to $${formatNumber(max)}`;
      }
      return `Up to ${formatNumber(max)}`;
    }
    return "";
  };

  const handleLocationSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setMatchingLocations([]);
        setShowLocationDropdown(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`${LOCATION_SEARCH_API}?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        // Handle both array and object response formats
        const locations = data.locations || data || [];
        
        setMatchingLocations(locations);
        // Always show dropdown if we're loading or have results
        setShowLocationDropdown(true);
      } catch (error) {
        console.error('Error fetching locations:', error);
        setMatchingLocations([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  const handleLocationSelect = (location) => {
    setFilters(prev => ({ ...prev, searchQuery: location }));
    setShowLocationDropdown(false);
    handleFilterChange("searchQuery", location);
  };

  return (
    <div className={styles.searchSection}>
      <div className={styles.container}>
        <div className={styles.searchBar}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by location"
            className={styles.searchInput}
            value={filters.searchQuery}
            onChange={(e) => {
              const value = e.target.value;
              setFilters(prev => ({ ...prev, searchQuery: value }));
              handleLocationSearch(value);
            }}
            onFocus={() => {
              setShowLocationDropdown(true);
              if (filters.searchQuery) {
                handleLocationSearch(filters.searchQuery);
              }
            }}
            onClick={() => {
              setShowLocationDropdown(true);
              if (filters.searchQuery) {
                handleLocationSearch(filters.searchQuery);
              }
            }}
          />
        </div>

        <div className={styles.filterButtons}>
          <select
            className={`${styles.filterBtn}`}
            value={filters.propertyType}
            onClick={() => {
              setShowPricePopup(false);
              setShowSqFtPopup(false);
            }}
            onChange={(e) => {
              closeAllPopups();
              handleFilterChange("propertyType", e.target.value);
            }}
          >
            <option value="">Property Types</option>
            {filterOptions.propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          
          <div className={styles.filterButtonWrapper}>
            <button
              className={`${styles.filterBtn} ${filters.price ? styles.active : ''}`}
              onClick={() => setShowPricePopup(true)}
            >
              {filters.price ? (
                <span className={styles.value}>{formatRangeDisplay(filters.price, true)}</span>
              ) : (
                <span>Price</span>
              )}
            </button>
            {filters.price && (
              <button
                className={styles.clearFilterButton}
                onClick={() => clearFilter("price")}
              >
                ×
              </button>
            )}
          </div>

          <select
            className={styles.filterBtn}
            value={filters.bedrooms}
            onClick={() => {
              setShowPricePopup(false);
              setShowSqFtPopup(false);
            }}
            onChange={(e) => {
              closeAllPopups();
              handleFilterChange("bedrooms", e.target.value);
            }}
          >
            <option value="">Bedrooms</option>
            {filterOptions.bedrooms.map((bedroom) => (
              <option key={bedroom} value={bedroom}>
                {bedroom} Bedroom{bedroom > 1 ? "s" : ""}
              </option>
            ))}
          </select>

          <select
            className={styles.filterBtn}
            value={filters.bathrooms}
            onClick={() => {
              setShowPricePopup(false);
              setShowSqFtPopup(false);
            }}
            onChange={(e) => {
              closeAllPopups();
              handleFilterChange("bathrooms", e.target.value);
            }}
          >
            <option value="">Bathrooms</option>
            {filterOptions.bathrooms.map((bathroom) => (
              <option key={bathroom} value={bathroom}>
                {bathroom} Bathroom{bathroom > 1 ? "s" : ""}
              </option>
            ))}
          </select>

          <div className={styles.filterButtonWrapper}>
            <button
              className={`${styles.filterBtn} ${filters.sqFt ? styles.active : ''}`}
              onClick={() => setShowSqFtPopup(true)}
            >
              {filters.sqFt ? (
                <span className={styles.value}>{formatRangeDisplay(filters.sqFt)}</span>
              ) : (
                <span>Area</span>
              )}
            </button>
            {filters.sqFt && (
              <button
                className={styles.clearFilterButton}
                onClick={() => clearFilter("sqFt")}
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>
      
      {(showLocationDropdown && filters.searchQuery) && (
        <div className={styles.locationDropdown}>
          {filters.searchQuery && (
            <button
              className={styles.clearButton}
              onClick={() => {
                setFilters(prev => ({ ...prev, searchQuery: "" }));
                setMatchingLocations([]);
                setShowLocationDropdown(false);
                handleFilterChange("searchQuery", "");
              }}
            >
              ×
            </button>
          )}
          {isLoading ? (
            <div className={styles.locationItem}>Loading...</div>
          ) : matchingLocations && matchingLocations.length > 0 ? (
            matchingLocations.map((location, index) => (
              <div
                key={index}
                className={styles.locationItem}
                onClick={() => handleLocationSelect(location)}
              >
                {location}
              </div>
            ))
          ) : (
            <div className={styles.locationItem}>
              No locations found
              {filters.searchQuery && (
                <button
                  className={styles.clearButton}
                  onClick={() => {
                    setFilters(prev => ({ ...prev, searchQuery: "" }));
                    setMatchingLocations([]);
                    setShowLocationDropdown(false);
                    handleFilterChange("searchQuery", "");
                  }}
                >
                  ×
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchSection;
