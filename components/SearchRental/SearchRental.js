import React, { useState, useEffect, useCallback } from "react";
import debounce from 'lodash/debounce';
import styles from "./SearchRental.module.css";
import { RENTAL_LOCATION_SEARCH_API, FILTER_RENTAL_RESALE_API } from "@/routes/apiRoutes";

// Add a style tag to hide empty options when dropdown is open
const hideEmptyOptionsStyle = `
  select:focus option[value=""] {
    display: none !important;
  }
  option[value=""] {
    display: none !important;
  }
`;

const SearchSection = ({ onFilterChange, filterOptions, showPricePopup, setShowPricePopup, showSqFtPopup, setShowSqFtPopup, currentFilters = {}, onSearch }) => {
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

  const [searchQuery, setSearchQuery] = useState("");

  // Function to handle sqft range change
  const handleSqFtChange = (e) => {
    const newSqFt = e.target.value;
    const newFilters = { ...filters, sqFt: newSqFt };
    setFilters(newFilters);
    onFilterChange({ ...newFilters });
  };

  // Create debounced search function
  const debouncedSearch = useCallback(
    (query) => {
      // Create debounced function inside useCallback
      const search = debounce((query) => {
        if (onSearch) {
          onSearch(query);
        } else {
          handleLocationSearch(query);
        }
      }, 300);
      
      // Call the debounced function
      search(query);
      
      // Return cleanup function
      return () => search.cancel();
    },
    [onSearch]
  );
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Any additional cleanup if needed
    };
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.trim();
    setSearchQuery(query);
    
    // Hide location dropdown when searching
    setShowLocationDropdown(false);
    
    // Clear results if search is empty
    if (!query) {
      if (onSearch) onSearch('');
      setMatchingLocations([]);
      return;
    }
    
    // Trigger debounced search
    debouncedSearch(query);
  };

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

      // Handle price range
      if (field === 'price' && value) {
        const [priceMin, priceMax] = value.split('-');
        if (priceMin) backendFilters.price_min = priceMin;
        if (priceMax) backendFilters.price_max = priceMax;
      } else if (updatedFilters.price) {
        const [priceMin, priceMax] = updatedFilters.price.split('-');
        if (priceMin) backendFilters.price_min = priceMin;
        if (priceMax) backendFilters.price_max = priceMax;
      }

      // Handle area range (sqFt)
      if (field === 'sqFt' && value) {
        const [sqFtMin, sqFtMax] = value.split('-');
        if (sqFtMin) backendFilters.sq_ft_min = sqFtMin;
        if (sqFtMax) backendFilters.sq_ft_max = sqFtMax;
      } else if (updatedFilters.sqFt) {
        const [sqFtMin, sqFtMax] = updatedFilters.sqFt.split('-');
        if (sqFtMin) backendFilters.sq_ft_min = sqFtMin;
        if (sqFtMax) backendFilters.sq_ft_max = sqFtMax;
      }
      
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
    
    // Handle the case where value is already a range string like "min-max"
    if (typeof value === 'string' && value.includes('-')) {
      const [min, max] = value.split('-')
        .map(part => part.trim())
        .filter(part => part !== '');
      
      if (min && max) {
        if (isPrice) {
          return `${formatNumber(min)} - ${formatNumber(max)}`;
        }
        return `${formatNumber(min)} - ${formatNumber(max)}`;
      }
      if (min) {
        if (isPrice) {
          return `From ${formatNumber(min)}`;
        }
        return `From ${formatNumber(min)}`;
      }
      if (max) {
        if (isPrice) {
          return `Up to ${formatNumber(max)}`;
        }
        return `Up to ${formatNumber(max)}`;
      }
    }
    
    // Handle the case where value is a single number
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      return formatNumber(value);
    }
    
    return "";
  };

  // Clear a specific filter
  const clearFilter = (field) => {
    // Create a new filters object without the field being cleared
    const { [field]: _, ...remainingFilters } = filters;
    setFilters({
      ...remainingFilters,
      // Reset the cleared field to empty string
      [field]: ""
    });
    
    // Format the filters to match backend expectations
    const backendFilters = {
      property_type: field === 'propertyType' ? null : (filters.propertyType || null),
      bedrooms: field === 'bedrooms' ? null : (filters.bedrooms || null),
      bathrooms: field === 'bathrooms' ? null : (filters.bathrooms || null),
      location: field === 'searchQuery' ? null : (filters.searchQuery || null),
    };

    // Handle price range
    if (field === 'price') {
      backendFilters.price_min = null;
      backendFilters.price_max = null;
    } else if (filters.price) {
      const [priceMin, priceMax] = filters.price.split('-');
      backendFilters.price_min = priceMin || null;
      backendFilters.price_max = priceMax || null;
    }

    // Handle sqFt range
    if (field === 'sqFt') {
      backendFilters.sq_ft_min = null;
      backendFilters.sq_ft_max = null;
    } else if (filters.sqFt) {
      const [sqFtMin, sqFtMax] = filters.sqFt.split('-');
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

  // Handle price range apply
  const handlePriceApply = (value) => {
    setFilters(prev => ({
      ...prev,
      price: value || ""
    }));
    onFilterChange({ ...filters, price: value });
    setShowPricePopup(false);
  };

  // Handle area range apply
  const handleSqFtApply = (value) => {
    setFilters(prev => ({
      ...prev,
      sqFt: value || ""
    }));
    onFilterChange({ ...filters, sqFt: value });
    setShowSqFtPopup(false);
  };

  // Replace handleLocationSearch to use FILTER_RENTAL_RESALE_API and 'location' param only
  const handleLocationSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setMatchingLocations([]);
        setShowLocationDropdown(false);
        return;
      }

      setIsLoading(true);
      try {
        // Use rental_filter endpoint with location param
        const url = `${FILTER_RENTAL_RESALE_API}?location=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        // Try to extract locations from the response
        let locations = [];
        if (Array.isArray(data)) {
          locations = data;
        } else if (data && typeof data === 'object') {
          if (Array.isArray(data.locations)) {
            locations = data.locations.filter(Boolean);
          } else if (Array.isArray(data.data)) {
            locations = data.data;
          } else if (Object.keys(data).length > 0) {
            locations = Object.values(data).filter(Boolean);
          }
        }
        if (!Array.isArray(locations)) locations = [];
        const transformedLocations = locations.map(location => {
          if (!location) return '';
          if (typeof location === 'string') return location;
          if (typeof location === 'object') {
            return location.name || location.title || location.location || location.label || location.value || (location.locations && location.locations[0]) || JSON.stringify(location);
          }
          return String(location);
        }).filter(Boolean);
        setMatchingLocations(transformedLocations);
        setShowLocationDropdown(true);
      } catch (error) {
        setMatchingLocations([]);
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
            placeholder="Search by location or property title"
            className={styles.searchInput}
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => {
              setShowLocationDropdown(true);
              if (filters.searchQuery) {
                handleLocationSearch(filters.searchQuery);
              }
            }}
          />
        </div>

        <div className={styles.filterButtons}>
          <div className={styles.filterWithClear}>
            <select
              className={`${styles.filterBtn}`}
              value={filters.propertyType}
              onClick={() => {
                setShowPricePopup(false);
                setShowSqFtPopup(false);
              }}
              onChange={(e) => handleFilterChange("propertyType", e.target.value)}
              style={{ paddingRight: filters.propertyType !== undefined && filters.propertyType !== '' ? '30px' : '16px' }}
            >
              <option value="">Property Type</option>
              {filterOptions.propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {(filters.propertyType !== undefined && filters.propertyType !== '') && (
              <button 
                className={styles.clearButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFilterChange("propertyType", "");
                }}
              >
                ×
              </button>
            )}
          </div>

          <div className={styles.filterWithClear}>
            <div style={{ position: 'relative' }}>
              <button
                className={`${styles.filterBtn} ${filters.price ? styles.active : ''}`}
                style={{ paddingRight: filters.price ? '30px' : '16px', position: 'relative' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPricePopup(!showPricePopup);
                  setShowSqFtPopup(false);
                }}
              >
                {filters.price && (
                  <button 
                    className={styles.clearButton}
                    style={{ position: 'absolute', left: 0, top: 10, zIndex: 2 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFilter("price");
                      setShowPricePopup(false);
                    }}
                  >
                    ×
                  </button>
                )}
                {filters.price ? (
                  <span className={styles.value} style={{ paddingRight: '10px' }}>
                    {`AED ${formatRangeDisplay(filters.price)}`}
                  </span>
                ) : (
                  <span>Price</span>
                )}
              </button>
            </div>
          </div>
          <div className={styles.filterWithClear}>
            <select
              className={`${styles.filterBtn}`}
              value={filters.bedrooms}
              onClick={() => {
                setShowPricePopup(false);
                setShowSqFtPopup(false);
              }}
              onChange={(e) => handleFilterChange("bedrooms", e.target.value)}
              style={{ paddingRight: (filters.bedrooms !== undefined && filters.bedrooms !== '') ? '30px' : '16px' }}
            >
              <option value="">Bedrooms</option>
              {filterOptions.bedrooms.map((num) => (
                <option key={num} value={num}>
                  {num === "studio" ? "Studio" : num}
                </option>
              ))}
            </select>
            {(filters.bedrooms !== undefined && filters.bedrooms !== '') && (
              <button 
                className={styles.clearButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFilterChange("bedrooms", "");
                }}
              >
                ×
              </button>
            )}
          </div>

          <div className={styles.filterWithClear}>
            <select
              className={`${styles.filterBtn}`}
              value={filters.bathrooms}
              onClick={() => {
                setShowPricePopup(false);
                setShowSqFtPopup(false);
              }}
              onChange={(e) => handleFilterChange("bathrooms", e.target.value)}
              style={{ paddingRight: (filters.bathrooms !== undefined && filters.bathrooms !== '') ? '30px' : '16px' }}
            >
              <option value="">Bathrooms</option>
              {filterOptions.bathrooms.map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            {(filters.bathrooms !== undefined && filters.bathrooms !== '') && (
              <button 
                className={styles.clearButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFilterChange("bathrooms", "");
                }}
              >
                ×
              </button>
            )}
          </div>

          <div className={styles.filterWithClear}>
            <div style={{ position: 'relative' }}>
              <button
                className={`${styles.filterBtn} ${filters.sqFt ? styles.active : ''}`}
                style={{ paddingRight: filters.sqFt ? '30px' : '16px', position: 'relative' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSqFtPopup(!showSqFtPopup);
                  setShowPricePopup(false);
                }}
              >
                {filters.sqFt && (
                  <button 
                    className={styles.clearButton}
                    style={{ position: 'absolute', left: 0, top: 10, zIndex: 2 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFilter("sqFt");
                      setShowSqFtPopup(false);
                    }}
                  >
                    ×
                  </button>
                )}
                {filters.sqFt ? (
                  <span className={styles.value} style={{ paddingRight: '10px' }}>
                    {`${formatRangeDisplay(filters.sqFt)} sq.ft`}
                  </span>
                ) : (
                  <span>Area</span>
                )}
              </button>
            </div>
           
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
