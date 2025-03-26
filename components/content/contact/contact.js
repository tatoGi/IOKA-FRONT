"use client";
import React from "react";
import ContactForm from "../../contactForm/ContactForm";
import styles from "./contact.module.css";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import dynamic from "next/dynamic";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

// Dynamic import of Map component with no SSR and suspense
const MapComponent = dynamic(() => import("../../Map/Map"), {
  ssr: false,
  loading: () => (
    <div className={styles.mapPlaceholder}>
      <div>Loading map...</div>
    </div>
  )
});

const Contact = () => {
  return (
    <div className="contact-page">
      <div className={styles.contactPage}>
        <div className={styles.contactInfo}>
          <div className={styles.infoSection}>
            <h2>Need any help?</h2>
            <h1>Get in touch with us</h1>
            <div className={styles.contactDetails}>
              <div className={styles.contactItem}>
                <span className={styles.iconWrapper}>
                  <FaPhone className={styles.icon_call} />
                </span>
                <div>
                  <h3>Have any question?</h3>
                  <p>Free +1(123) 456-7890</p>
                </div>
              </div>

              <div className={styles.contactItem}>
                <span className={styles.iconWrapper}>
                  <FaEnvelope className={styles.icon} />
                </span>
                <div>
                  <h3>Write email</h3>
                  <p>needhelp@company.com</p>
                </div>
              </div>

              <div className={styles.contactItem}>
                <span className={styles.iconWrapper}>
                  <FaMapMarkerAlt className={styles.icon} />
                </span>
                <div>
                  <h3>Visit anytime</h3>
                  <p>66 brooklyn golden street. New York</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.mapSection}>
            <div className={styles.mapWrapper}>
              <MapComponent />
            </div>
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
};

export default Contact;
