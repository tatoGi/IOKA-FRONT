import React, { useState, useEffect, useCallback } from "react";
import styles from "./SearchRental.module.css";
import { LOCATION_SEARCH_API } from "@/routes/apiRoutes";

// Add a style tag to hide empty options when dropdown is open
const hideEmptyOptionsStyle = `
  select:focus option[value=""] {
    display: none !important;
  }
  option[value=""] {
    display: none !important;
  }
`;

const SearchSection = ({ onFilterChange, filterOptions, showPricePopup, setShowPricePopup, showSqFtPopup, setShowSqFtPopup, currentFilters = {} }) => {
  // Add style to head
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = hideEmptyOptionsStyle;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
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

  const [matchingLocations, setMatchingLocations] = useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

      // Format the filters to match backend expectations
      const backendFilters = {
        property_type: updatedFilters.propertyType || null,
        location: updatedFilters.searchQuery || null,
      };
      
      // Handle bedrooms - special case for "4+" to filter 4 or more
      if (updatedFilters.bedrooms) {
        if (updatedFilters.bedrooms === "4+") {
          backendFilters.bedrooms_min = 4;
        } else {
          backendFilters.bedrooms = updatedFilters.bedrooms;
        }
      } else {
        backendFilters.bedrooms = null;
      }
      
      // Handle bathrooms - special case for "4+" to filter 4 or more
      if (updatedFilters.bathrooms) {
        if (updatedFilters.bathrooms === "4+") {
          backendFilters.bathrooms_min = 4;
        } else {
          backendFilters.bathrooms = updatedFilters.bathrooms;
        }
      } else {
        backendFilters.bathrooms = null;
      }

      // Handle price range
      if (updatedFilters.price) {
        const [priceMin, priceMax] = updatedFilters.price.split('-');
        backendFilters.price_min = priceMin || null;
        backendFilters.price_max = priceMax || null;
      }

      // Handle sqFt range
      if (updatedFilters.sqFt) {
        const [sqFtMin, sqFtMax] = updatedFilters.sqFt.split('-');
        backendFilters.sq_ft_min = sqFtMin || null;
        backendFilters.sq_ft_max = sqFtMax || null;
      }

      // Remove null or empty values from the query parameters
      const filteredParams = Object.fromEntries(
        Object.entries(backendFilters).filter(
          ([_, v]) => v !== null && v !== ""
        )
      );

      // If all filters are cleared, send null to indicate we should use default API
      onFilterChange(Object.keys(filteredParams).length === 0 ? null : filteredParams);
    }, 500),
    [filters, onFilterChange]
  );

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

  const clearFilter = (field) => {
    const updatedFilters = { ...filters, [field]: "" };
    setFilters(updatedFilters);
    
    // Format the filters to match backend expectations
    const backendFilters = {
      property_type: updatedFilters.propertyType || null,
      location: updatedFilters.searchQuery || null,
    };
    
    // Handle bedrooms - special case for "4+" to filter 4 or more
    if (updatedFilters.bedrooms) {
      if (updatedFilters.bedrooms === "4+") {
        backendFilters.bedrooms_min = 4;
      } else {
        backendFilters.bedrooms = updatedFilters.bedrooms;
      }
    } else {
      backendFilters.bedrooms = null;
    }
    
    // Handle bathrooms - special case for "4+" to filter 4 or more
    if (updatedFilters.bathrooms) {
      if (updatedFilters.bathrooms === "4+") {
        backendFilters.bathrooms_min = 4;
      } else {
        backendFilters.bathrooms = updatedFilters.bathrooms;
      }
    } else {
      backendFilters.bathrooms = null;
    }

    // Handle price range
    if (updatedFilters.price) {
      const [priceMin, priceMax] = updatedFilters.price.split('-');
      backendFilters.price_min = priceMin || null;
      backendFilters.price_max = priceMax || null;
    }

    // Handle sqFt range
    if (updatedFilters.sqFt) {
      const [sqFtMin, sqFtMax] = updatedFilters.sqFt.split('-');
      backendFilters.sq_ft_min = sqFtMin || null;
      backendFilters.sq_ft_max = sqFtMax || null;
    }

    // Remove null or empty values from the query parameters
    const filteredParams = Object.fromEntries(
      Object.entries(backendFilters).filter(
        ([_, v]) => v !== null && v !== ""
      )
    );

    // Call onFilterChange with the updated filters
    onFilterChange(Object.keys(filteredParams).length === 0 ? null : filteredParams);
  };

  const handleRangeApply = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    handleFilterChange(field, value);
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
        
        // Check if response is ok
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Check if response is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not JSON");
        }
        
        const data = await response.json();
        
        // Handle both array and object response formats
        const locations = data.locations || data || [];
        
        // Transform location data to handle both string and object formats
        const transformedLocations = locations.map(location => {
          if (typeof location === 'string') {
            return location;
          } else if (location && typeof location === 'object') {
            return location.title || location.name || location.location || JSON.stringify(location);
          }
          return String(location);
        });
        
        setMatchingLocations(transformedLocations);
        // Always show dropdown if we're loading or have results
        setShowLocationDropdown(true);
      } catch (error) {
        console.error('Error fetching locations:', error);
        
        // Fallback: provide some basic location suggestions
        const fallbackLocations = [
          'Dubai Marina',
          'Palm Jumeirah',
          'Downtown Dubai',
          'JBR',
          'Business Bay',
          'Dubai Hills Estate',
          'Arabian Ranches',
          'Emirates Hills',
          'Meadows',
          'Springs'
        ].filter(location => 
          location.toLowerCase().includes(query.toLowerCase())
        );
        
        setMatchingLocations(fallbackLocations);
        setShowLocationDropdown(true);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  const handleLocationSelect = (location) => {
    // Extract the location title if it's an object, otherwise use the string
    const locationValue = typeof location === 'object' ? location.title : location;
    setFilters(prev => ({ ...prev, searchQuery: locationValue }));
    setShowLocationDropdown(false);
    handleFilterChange("searchQuery", locationValue);
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
            onChange={(e) => handleFilterChange("propertyType", e.target.value)}
          >
            <option value="">Property Type</option>
            {filterOptions.propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <div className={styles.filterBtnWrapper}>
            <button
              className={`${styles.filterBtn} ${filters.price ? styles.active : ''}`}
              onClick={() => {
                setShowPricePopup(!showPricePopup);
                setShowSqFtPopup(false);
              }}
            >
              {filters.price ? (
                <span className={styles.value}>{formatRangeDisplay(filters.price, true)}</span>
              ) : (
                "Price"
              )}
              {filters.price && (
                <button
                  className={styles.clearFilterButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFilter("price");
                  }}
                >
                  ×
                </button>
              )}
            </button>
          </div>

          <select
            className={`${styles.filterBtn}`}
            value={filters.bedrooms}
            onClick={() => {
              setShowPricePopup(false);
              setShowSqFtPopup(false);
            }}
            onChange={(e) => handleFilterChange("bedrooms", e.target.value)}
          >
            <option value="">Bedrooms</option>
            {filterOptions.bedrooms.map((num) => (
              <option key={num} value={num}>
                {num === "studio" ? "Studio" : num}
              </option>
            ))}
          </select>

          <select
            className={`${styles.filterBtn}`}
            value={filters.bathrooms}
            onClick={() => {
              setShowPricePopup(false);
              setShowSqFtPopup(false);
            }}
            onChange={(e) => handleFilterChange("bathrooms", e.target.value)}
          >
            <option value="">Bathrooms</option>
            {filterOptions.bathrooms.map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>

          <div className={styles.filterBtnWrapper}>
            <button
              className={`${styles.filterBtn} ${filters.sqFt ? styles.active : ''}`}
              onClick={() => {
                setShowSqFtPopup(!showSqFtPopup);
                setShowPricePopup(false);
              }}
            >
              {filters.sqFt ? (
                <span className={styles.value}>{formatRangeDisplay(filters.sqFt)}</span>
              ) : (
                "Area"
              )}
              {filters.sqFt && (
                <button
                  className={styles.clearFilterButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFilter("sqFt");
                  }}
                >
                  ×
                </button>
              )}
            </button>
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
                {typeof location === 'object' ? location.title || location.name : location}
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
