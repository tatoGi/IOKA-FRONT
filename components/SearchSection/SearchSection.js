import React, { useState } from "react";
import styles from "./SearchSection.module.css";
import { FiSearch } from "react-icons/fi";
import Image from "next/image";
import filterVector from "../../assets/img/filter.svg";

const SearchSection = ({ onFilterChange, filterOptions }) => {
  console.log(filterOptions);
  const [filters, setFilters] = useState({
    propertyType: "",
    price: "",
    bedrooms: "",
    listedAs: "",
    searchQuery: "",
  });

  const handleFilterChange = async (field, value) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);

    const backendFilters = {
      property_type: updatedFilters.propertyType,
      price_min: updatedFilters.price.split("-")[0] || null,
      price_max: updatedFilters.price.split("-")[1] || null,
      bedrooms: updatedFilters.bedrooms,
      location: updatedFilters.searchQuery,
    };

    // Remove null or empty values from the query parameters
    const filteredParams = Object.fromEntries(
      Object.entries(backendFilters).filter(
        ([_, v]) => v !== null && v !== ""
      )
    );

    // Notify parent component with the updated filters
    onFilterChange(filteredParams);
  };

  return (
    <div className={styles.searchSection}>
      <div className={styles.container}>
        <div className={styles.searchBar}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="City, Building or community"
            className={styles.searchInput}
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
          />
        </div>
        <div className={styles.filterButtons}>
          <select
            className={styles.filterBtn}
            value={filters.propertyType}
            onChange={(e) => handleFilterChange("propertyType", e.target.value)}
          >
            <option value="">Property type</option>
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
