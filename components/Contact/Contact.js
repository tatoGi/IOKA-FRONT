"use client";
import React, { useState, useEffect } from "react";
import ContactForm from "../contactForm/ContactForm";
import styles from "./contact.module.css";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import dynamic from "next/dynamic";
import { CONTACT_API } from "../../routes/apiRoutes";
import axios from "axios";
import "leaflet/dist/leaflet.css";

const MapComponent = dynamic(
  () => import("../Map/Map").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className={styles.mapPlaceholder}>
        <div>Loading map...</div>
      </div>
    )
  }
);

const Contact = ({ initialData, id }) => {
  const [cardData, setCardData] = useState(initialData || {});
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        console.error("No ID provided to Contact component");
        return;
      }
      try {
        const response = await axios.get(`${CONTACT_API}/${id}`);
        if (response.data && response.data.contact) {
          setCardData(response.data.contact);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      }
    };

    if (!initialData && id) {
      fetchData();
    }
  }, [initialData, id]);

  if (error) {
    return <div className={styles.errorContainer}>Error loading contact information: {error}</div>;
  }

  return (
    <div className={styles.contactPage}>
      <div className={`container ${styles.containerWithMargin}`}>
        <div className={`row align-items-stretch ${styles.rowWithBorder}`}>
          <div className="col-md-6 d-flex flex-column">
            <div className={styles.infoSection}>
              {!isMobile && <h2>{cardData.additional_fields?.subtitle}</h2>}
              <h1>{cardData.additional_fields?.title}</h1>
              <div
                dangerouslySetInnerHTML={{
                  __html: cardData.additional_fields?.description,
                }}
              ></div>
              {!isMobile && (
                <div className={styles.contactDetails}>
                  {cardData.additional_fields?.phone_numbers?.map((phone, index) => (
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
                  {cardData.additional_fields?.email_addresses?.map((email, index) => (
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
                  {cardData.additional_fields?.locations?.map((location, index) => (
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
              )}
            </div>
          </div>
          <div className={`${isMobile ? 'w-100 p-0' : 'col-md-6'}`}>
            <div className={styles.mapSection}>
              <MapComponent locations={cardData.additional_fields?.locations || []} />
            </div>
          </div>
        </div>
        {isMobile && (
          <div className={styles.contactDetails}>
            {cardData.additional_fields?.phone_numbers?.map((phone, index) => (
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
            {cardData.additional_fields?.email_addresses?.map((email, index) => (
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
            {cardData.additional_fields?.locations?.map((location, index) => (
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
        )}
      </div>
      <div className={`container ${styles.containerWithMargin}`}>
        <ContactForm pageTitle="Contact Page"/>
      </div>
    </div>
  );
};

export default Contact;
