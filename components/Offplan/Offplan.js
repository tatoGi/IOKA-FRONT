import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import SearchSection from "../SearchSection/SearchSection";
import Image from "next/image";
import {
  BedIcon,
  BathIcon,
  AreaIcon,
  CarIcon,
  StarIcon,
  CompareIcon
} from "../icons/PropertyIcons";
import styles from "./Offplan.module.css";

// Dynamic import of Map component with no SSR
const Map = dynamic(() => import("../Map/Map"), {
  ssr: false,
  loading: () => <div className={styles.mapLoading}>Loading map...</div>
});

const Offplan = () => {
  const [properties] = useState([
    {
      id: 1,
      title: "Affordable Urban House",
      location: "1421 San Pedro Fujairah",
      price: 1250000,
      beds: 3,
      baths: 3,
      area: 2300,
      image: "/images/property1.jpg",
      exclusive: true,
      car: 1,
      position: [25.2048, 55.2708]
    },
    {
      id: 2,
      title: "Affordable Urban House",
      location: "1421 San Pedro Fujairah",
      price: 1250000,
      beds: 3,
      baths: 3,
      area: 2300,
      image: "/images/property1.jpg",
      exclusive: true,
      car: 2,
      position: [25.2048, 55.2708] // Dubai coordinates
    },
    {
      id: 3,
      title: "Affordable Urban House",
      location: "1421 San Pedro Fujairah",
      price: 1250000,
      beds: 3,
      baths: 3,
      area: 2300,
      image: "/images/property1.jpg",
      exclusive: true,
      car: 3,
      position: [25.2048, 55.2708] // Dubai coordinates
    },
    {
      id: 4,
      title: "Affordable Urban House",
      location: "1421 San Pedro Fujairah",
      price: 1250000,
      beds: 3,
      baths: 3,
      area: 2300,
      image: "/images/property1.jpg",
      exclusive: true,
      car: 2,
      position: [25.2048, 55.2708] // Dubai coordinates
    }
    // ... Add more items to make 20 total
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.listSection}>
        <SearchSection />
        <div className={styles.resultsHeader}>
          <h2 className={styles.title}>
            New Developments for sale in Dubai
            <span className={styles.resultsCount}>
              {properties.length} Results
            </span>
          </h2>
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
                      <BedIcon />
                      <span>{property.beds} Br</span>
                    </div>
                    <div className={styles.feature}>
                      <BathIcon />
                      <span>{property.baths} Ba</span>
                    </div>
                    <div className={styles.feature}>
                      <AreaIcon />
                      <span>{property.area} Sq.Ft</span>
                    </div>
                    <div className={styles.feature}>
                      <CarIcon />
                      <span>{property.car} Cr</span>
                    </div>
                  </div>

                  <div className={styles.priceRow}>
                    <span className={styles.price}>
                      ${property.price.toLocaleString()}
                    </span>
                    <div className={styles.actions}>
                      <button className={styles.actionButton}>
                        <StarIcon />
                      </button>
                      <button className={styles.actionButton}>
                        <CompareIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.mapSection}>
        <Map properties={properties} />
      </div>
    </div>
  );
};

export default Offplan;
