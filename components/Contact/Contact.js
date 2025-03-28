"use client";
import React, { useState, useEffect } from "react";
import ContactForm from "../contactForm/ContactForm";
import styles from "./contact.module.css";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import dynamic from "next/dynamic";
import { CONTACT_API } from "../../routes/apiRoutes"; // Import the routes
import axios from "axios"; // Add axios import
// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

// Dynamic import of Map component with no SSR and suspense
const MapComponent = dynamic(() => import("../Map/Map"), {
  ssr: false,
  loading: () => (
    <div className={styles.mapPlaceholder}>
      <div>Loading map...</div>
    </div>
  )
});

const Contact = ({ initialData, id }) => {
  const [cardData, setCardData] = useState(initialData || {});
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        console.error("No ID provided to AboutUs component");
        return;
      }
      try {
        const response = await axios.get(`${CONTACT_API}/${id}`);
        if (response.data && response.data.contact) {
          setCardData(response.data.contact);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (!initialData && id) {
      fetchData();
    }
  }, [initialData, id]);
  return (
    <div className="contact-page">
      <div className={styles.contactPage}>
        <div className="container"></div>
        <div className={styles.contactInfo}>
          <div className={styles.infoSection}>
            <h2>{cardData.additional_fields?.subtitle}</h2>       
            <h1>{cardData.additional_fields?.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: cardData.additional_fields?.description }}></div>
            <div className={styles.contactDetails}>
              {cardData.additional_fields?.phone_numbers && cardData.additional_fields?.phone_numbers.map((phone, index) => (
                <div key={index} className={styles.contactItem}>
                  <span className={styles.iconWrapper}>
                    <FaPhone className={styles.icon_call} />
                  </span>
                  <div>
                    <h3>Have any question?</h3>
                    <p>{phone.phone}</p>
                  </div>
                </div>
              ))}
              {cardData.additional_fields?.email_addresses && cardData.additional_fields?.email_addresses.map((email, index) => (
                <div key={index} className={styles.contactItem}>
                  <span className={styles.iconWrapper}>
                    <FaEnvelope className={styles.icon} />
                  </span>
                  <div>
                    <h3>Write email</h3>
                    <p>{email.email}</p>
                  </div>
                </div>
              ))}
              {cardData.additional_fields?.locations && cardData.additional_fields?.locations.map((location, index) => (
                <div key={index} className={styles.contactItem}>
                  <span className={styles.iconWrapper}>
                    <FaMapMarkerAlt className={styles.icon} />
                  </span>
                  <div>
                    <h3>Visit anytime</h3>
                    <p>{location.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.mapSection}>
            <div className={styles.mapWrapper}>
             
              <MapComponent locations={cardData.additional_fields?.locations} />
            </div>
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
};

export default Contact;
