import React, { useState, useEffect, useCallback } from "react";
import styles from "./SearchSection.module.css";
import { FiSearch } from "react-icons/fi";
import Image from "next/image";
import filterVector from "../../assets/img/filter.svg";

const SearchSection = ({ onFilterChange, filterOptions }) => {
  const [filters, setFilters] = useState({
    propertyType: "",
    price: "",
    bedrooms: "",
    listedAs: "",
    searchQuery: "",
  });

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
        location: field === 'searchQuery' ? value : null,
      };

      // Remove null or empty values from the query parameters
      const filteredParams = Object.fromEntries(
        Object.entries(backendFilters).filter(
          ([_, v]) => v !== null && v !== ""
        )
      );

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
            className={styles.filterBtn}
            value={filters.propertyType}
            onChange={(e) => handleFilterChange("propertyType", e.target.value)}
          >
            <option value="">All Property Types</option>
            {filterOptions.propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            className={styles.filterBtn}
            value={filters.price}
            onChange={(e) => handleFilterChange("price", e.target.value)}
          >
            <option value="">Price</option>
            {filterOptions.priceRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
          <select
            className={styles.filterBtn}
            value={filters.bedrooms}
            onChange={(e) => handleFilterChange("bedrooms", e.target.value)}
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
            value={filters.listedAs}
            onChange={(e) => handleFilterChange("listedAs", e.target.value)}
          >
            <option value="">Listed as</option>
            {filterOptions.listedAs.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button
            className={styles.moreFiltersBtn}
            style={{ width: "143px", height: "40px" }}
          >
            More Filters
            <Image src={filterVector} alt="Filter" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
