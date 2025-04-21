import React, { useState, useEffect, useCallback } from "react";
import styles from "./SearchSection.module.css";
import { FiSearch } from "react-icons/fi";
import Image from "next/image";
import filterVector from "../../assets/img/filter.svg";
import RangeInputPopup from "./RangeInputPopup";

const SearchSection = ({ onFilterChange, filterOptions }) => {
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      document.body.classList.add('ios-device');
    }
  }, []);

  const [filters, setFilters] = useState({
    propertyType: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    sqFt: "",
    searchQuery: "",
  });

  const [showPricePopup, setShowPricePopup] = useState(false);
  const [showSqFtPopup, setShowSqFtPopup] = useState(false);

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

      const backendFilters = {
        property_type: updatedFilters.propertyType || null,
        price_min: updatedFilters.price ? updatedFilters.price.split("-")[0] : null,
        price_max: updatedFilters.price ? updatedFilters.price.split("-")[1] : null,
        bedrooms: updatedFilters.bedrooms || null,
        bathrooms: updatedFilters.bathrooms || null,
        sq_ft_min: updatedFilters.sqFt ? updatedFilters.sqFt.split("-")[0] : null,
        sq_ft_max: updatedFilters.sqFt ? updatedFilters.sqFt.split("-")[1] : null,
        location: field === 'searchQuery' ? value : null,
      };

  

      // Remove null or empty values from the query parameters
      const filteredParams = Object.fromEntries(
        Object.entries(backendFilters).filter(
          ([_, v]) => v !== null && v !== ""
        )
      );

      console.log('Filtered params being sent:', filteredParams);

      // If all filters are cleared, send null to indicate we should use OFFPLAN_APi
      onFilterChange(Object.keys(filteredParams).length === 0 ? null : filteredParams);
    }, 500),
    [filters, onFilterChange]
  );

  // Add a function to clear individual filters
  const clearFilter = (field) => {
    setFilters(prev => ({ ...prev, [field]: "" }));
    handleFilterChange(field, "");
  };

  const handleRangeApply = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    handleFilterChange(field, value);
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
        return `${formatNumber(min)} - ${formatNumber(max)}`;
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
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleFilterChange("searchQuery", e.target.value);
              }
            }}
          />
          {filters.searchQuery && (
            <button
              className={styles.clearButton}
              onClick={() => clearFilter("searchQuery")}
            >
              ×
            </button>
          )}
        </div>
        <div className={styles.filterButtons}>
          <select
            className={`${styles.filterBtn} ${styles.propertyType}`}
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
              <span>Price</span>
              <span className={styles.value}>{formatRangeDisplay(filters.price, true)}</span>
            </button>
            {filters.price && (
              <button
                className={styles.clearFilterButton}
                onClick={() => clearFilter("price")}
              >
                ×
              </button>
            )}
            {showPricePopup && (
              <div className={styles.popupContainer}>
                <RangeInputPopup
                  isOpen={showPricePopup}
                  onClose={() => setShowPricePopup(false)}
                  onApply={(value) => handleRangeApply("price", value)}
                  title="Price Range"
                  unit="USD"
                />
              </div>
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
              <span>Area</span>
              <span className={styles.value}>
                {filters.sqFt ? `${formatRangeDisplay(filters.sqFt)} Square Meters` : ""}
              </span>
            </button>
            {filters.sqFt && (
              <button
                className={styles.clearFilterButton}
                onClick={() => clearFilter("sqFt")}
              >
                ×
              </button>
            )}
            {showSqFtPopup && (
              <div className={styles.popupContainer}>
                <RangeInputPopup
                  isOpen={showSqFtPopup}
                  onClose={() => setShowSqFtPopup(false)}
                  onApply={(value) => handleRangeApply("sqFt", value)}
                  title="Area Range"
                  unit="Sq.Ft"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
