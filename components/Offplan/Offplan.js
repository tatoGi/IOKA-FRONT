import React, { useState } from "react";
import Link from "next/link";
import SearchSection from "../SearchSection/SearchSection";
import Image from "next/image";
import styles from "./Offplan.module.css";
import { Montserrat } from "next/font/google";
import {
  StarIcon,
} from "../icons/PropertyIcons";
// Configure Montserrat
const montserrat = Montserrat({
  subsets: ["latin"], // Specify the subsets you need
  weight: ["400", "500", "600", "700"], // Specify the weights you need
  variable: "--font-montserrat" // Optional: Use a CSS variable
});

const Offplan = () => {
   const [totalPages, setTotalPages] = useState(10); // Move inside component
  const [currentPage, setCurrentPage] = useState(1); // To track current page

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const [properties] = useState([
    {
      id: 1,
      title: "Affordable Urban House",
      location: "1421 San Pedro Fujairah",
      price: 1250000,
      beds: 3,
      baths: 3,
      area: 2300,
       image: require("/assets/img/default.webp"),
      exclusive: true,
      car: 1,
      position: [25.2048, 55.2708] // Dubai coordinates
    },
    {
      id: 2,
      title: "Luxury Villa",
      location: "Palm Jumeirah, Dubai",
      price: 4500000,
      beds: 5,
      baths: 5,
      area: 5000,
       image: require("/assets/img/default.webp"),
      exclusive: false,
      car: 2,
      position: [25.112, 55.138] // Dubai coordinates
    },
    {
      id: 3,
      title: "Downtown Apartment",
      location: "Burj Khalifa Blvd, Dubai",
      price: 2800000,
      beds: 2,
      baths: 2,
      area: 1800,
       image: require("/assets/img/default.webp"),
      exclusive: true,
      car: 1,
      position: [25.1972, 55.2744] // Downtown Dubai
    },
    {
      id: 4,
      title: "Cozy Townhouse",
      location: "JVC, Dubai",
      price: 1500000,
      beds: 3,
      baths: 3,
      area: 2100,
       image: require("/assets/img/default.webp"),
      exclusive: false,
      car: 2,
      position: [25.066, 55.221] // Jumeirah Village Circle
    },
    {
      id: 5,
      title: "Waterfront Condo",
      location: "Dubai Marina",
      price: 3200000,
      beds: 3,
      baths: 3,
      area: 2400,
       image: require("/assets/img/default.webp"),
      exclusive: true,
      car: 1,
      position: [25.078, 55.134] // Marina coordinates
    },
    {
      id: 6,
      title: "Golf Course Mansion",
      location: "Emirates Hills, Dubai",
      price: 12000000,
      beds: 7,
      baths: 8,
      area: 12000,
       image: require("/assets/img/default.webp"),
      exclusive: true,
      car: 5,
      position: [25.073, 55.162] // Emirates Hills
    },
    {
      id: 7,
      title: "Sky High Penthouse",
      location: "Bluewaters Island, Dubai",
      price: 7800000,
      beds: 4,
      baths: 4,
      area: 4000,
       image: require("/assets/img/default.webp"),
      exclusive: true,
      car: 2,
      position: [25.084, 55.119] // Bluewaters Island
    },
    {
      id: 8,
      title: "Beachfront Bungalow",
      location: "Jumeirah Beach, Dubai",
      price: 5000000,
      beds: 4,
      baths: 4,
      area: 3500,
       image: require("/assets/img/default.webp"),
      exclusive: false,
      car: 3,
      position: [25.188, 55.239] // Jumeirah Beach coordinates
    },
    {
      id: 9,
      title: "Modern Loft",
      location: "Business Bay, Dubai",
      price: 1700000,
      beds: 2,
      baths: 2,
      area: 1600,
       image: require("/assets/img/default.webp"),
      exclusive: false,
      car: 1,
      position: [25.184, 55.273] // Business Bay
    },
    {
      id: 10,
      title: "Urban Family Home",
      location: "Al Barsha, Dubai",
      price: 2100000,
      beds: 4,
      baths: 3,
      area: 2800,
       image: require("/assets/img/default.webp"),
      exclusive: true,
      car: 2,
      position: [25.118, 55.198] // Al Barsha
    }
  ]);
  

  return (
    <div className={`container ${styles.container} ${montserrat.className}`}>
      <div className={styles.listSection}>
        <SearchSection />
        <div className={styles.resultsHeader}>
          <h2 className={styles.title}>New Developments for sale in Dubai</h2>
        </div>

        <div className={styles.propertyGrid}>
          {properties.map((property) => (
            <Link
              href={`/offplan/show?id=${property.id}`}
              key={property.id}
              className={styles.propertyCardLink}
            >
              <div className={styles.propertyCard}>
                <div className={styles.imageContainer}>
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.propertyImage}
                    priority
                    unoptimized
                  />
                  {property.exclusive && (
                    <span className={styles.exclusive}>Exclusive</span>
                  )}
                </div>

                <div className={styles.propertyInfo}>
                  <h3 className={styles.title}>{property.title}</h3>
                  <p className={styles.location}>{property.location}</p>

                  <div className={styles.features}>
                    <div className={styles.feature}>
                      <Image
                         src={require("/assets/img/badicon.png")}
                        alt="Bed Icon"
                        width={24}
                        height={24}
                      />
                      <span>{property.beds} Br</span>
                    </div>
                    <div className={styles.feature}>
                      <Image
                       src={require("/assets/img/bathicon.png")}
                        alt="Bath Icon"
                        width={24}
                        height={24}
                      />
                      <span>{property.baths} Ba</span>
                    </div>
                    <div className={styles.feature}>
                      <Image
                        src={require("/assets/img/areavector.png")}
                        alt="Area Icon"
                        width={24}
                        height={24}
                      />
                      <span>{property.area} Sq.Ft</span>
                    </div>
                    <div className={styles.feature}>
                      <Image
                        src={require("/assets/img/warehousevector.png")}
                        alt="Car Icon"
                        width={24}
                        height={24}
                      />
                      <span>{property.car} Gr</span>
                    </div>
                  </div>

                  <div className={styles.priceRow}>
                    <span className={styles.price}>
                      USD {property.price.toLocaleString()}
                    </span>
                    <span className={styles.price}>
                      AED {property.price.toLocaleString()}
                    </span>
                    <div className={styles.actions}>
                      <button className={styles.actionButton}>
                        <StarIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className={styles.pagination}>
  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
    <button
      key={page}
      onClick={() => handlePageChange(page)}
      className={`${styles.pageButton} ${
        currentPage === page ? styles.active : ""
      }`}
    >
      {page}
    </button>
  ))}
  {/* Add Next Button */}
  <button
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === totalPages} // Disable if on the last page
    className={styles.pageButton}
  >
    Next
  </button>
</div>
      </div>
    </div>
  );
};

export default Offplan;
