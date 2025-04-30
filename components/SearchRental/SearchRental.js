import React, { useState, useEffect, useCallback } from "react";
import styles from "./SearchRental.module.css";
import { FiSearch } from "react-icons/fi";
import Image from "next/image";
import filterVector from "../../assets/img/filter.svg";
import { LOCATION_SEARCH_API } from "@/routes/apiRoutes";

const SearchSection = ({ onFilterChange, filterOptions, showPricePopup, setShowPricePopup, showSqFtPopup, setShowSqFtPopup, currentFilters = {} }) => {
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
        bedrooms: updatedFilters.bedrooms || null,
        bathrooms: updatedFilters.bathrooms || null,
        location: field === 'searchQuery' ? value : null,
      };

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
    
    // Create a new object with all current filters
    const newFilters = {
      ...filters,
      [field]: ""
    };
    
    // Call onFilterChange with the updated filters
    onFilterChange(newFilters);
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
                {num}
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
              <option key={num} value={num}>
                {num}
              </option>
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
