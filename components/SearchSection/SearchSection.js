import React, { useState, useEffect, useCallback } from "react";
import styles from "./SearchSection.module.css";
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
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.searchIcon} xmlns="http://www.w3.org/2000/svg">
<path d="M13 6.5C13 7.93437 12.5344 9.25938 11.75 10.3344L15.7063 14.2937C16.0969 14.6844 16.0969 15.3188 15.7063 15.7094C15.3156 16.1 14.6812 16.1 14.2906 15.7094L10.3344 11.75C9.25938 12.5375 7.93437 13 6.5 13C2.90937 13 0 10.0906 0 6.5C0 2.90937 2.90937 0 6.5 0C10.0906 0 13 2.90937 13 6.5ZM6.5 11C7.09095 11 7.67611 10.8836 8.22208 10.6575C8.76804 10.4313 9.26412 10.0998 9.68198 9.68198C10.0998 9.26412 10.4313 8.76804 10.6575 8.22208C10.8836 7.67611 11 7.09095 11 6.5C11 5.90905 10.8836 5.32389 10.6575 4.77792C10.4313 4.23196 10.0998 3.73588 9.68198 3.31802C9.26412 2.90016 8.76804 2.56869 8.22208 2.34254C7.67611 2.1164 7.09095 2 6.5 2C5.90905 2 5.32389 2.1164 4.77792 2.34254C4.23196 2.56869 3.73588 2.90016 3.31802 3.31802C2.90016 3.73588 2.56869 4.23196 2.34254 4.77792C2.1164 5.32389 2 5.90905 2 6.5C2 7.09095 2.1164 7.67611 2.34254 8.22208C2.56869 8.76804 2.90016 9.26412 3.31802 9.68198C3.73588 10.0998 4.23196 10.4313 4.77792 10.6575C5.32389 10.8836 5.90905 11 6.5 11Z" fill="#07151F"/>
</svg>

          <input
            type="text"
            placeholder="City, Building or community"
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
                {bedroom === "Studio" ? "Studio" : 
                 bedroom === "4+" ? "4+ Bedrooms" : 
                 `${bedroom} Bedroom${bedroom > 1 ? "s" : ""}`}
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
                {bathroom === "4+" ? "4+ Bathrooms" : 
                 `${bathroom} Bathroom${bathroom > 1 ? "s" : ""}`}
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
