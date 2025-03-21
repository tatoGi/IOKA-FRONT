import React, { useState } from "react";
import styles from "./Rental_Resale.show.module.css";
import Modal from "react-modal";
import Image from "next/image";
import SubscribeSection from "../SubscribeSection/SubscribeSection";
import defaultImage from "../../assets/img/default.webp"; // ✅ Correct import
import { StarIcon } from "../icons/PropertyIcons";
import dynamic from "next/dynamic";
Modal.setAppElement("#__next");

const RentalResaleShow = ({ RENTAL_RESALE_DATA }) => {
  const galleryImages = JSON.parse(RENTAL_RESALE_DATA.gallery_images || "[]");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const flattenedAddresses = RENTAL_RESALE_DATA.addresses.flat();
  const normalizedAmenities = RENTAL_RESALE_DATA.amenities.map((item) => {
    if (Array.isArray(item)) {
      return item[0]; // Extract the first element if it's an array
    } else if (typeof item === "object" && item !== null) {
      return Object.values(item)[0]; // Extract the first value if it's an object
    }
    return item; // Return the item as-is if it's already a string
  });
  const normalizedLanguages = RENTAL_RESALE_DATA.languages
    .map((item) => {
      if (Array.isArray(item)) {
        return item[0]; // Extract the first element if it's an array
      } else if (typeof item === "object" && item !== null) {
        return Object.values(item)[0]; // Extract the first value if it's an object
      }
      return item; // Return the item as-is if it's already a string
    })
    .filter(Boolean); // Remove any undefined or null values
  const languagesString = normalizedLanguages.join(", ");
  const Map = dynamic(
    () => import("./Map"), // Create a new Map.js component
    { ssr: false }
  );
  return (
    <>
      <div className="container">
        <div className={styles.gallery}>
          {/* Main Image */}
          <div className={styles.mainImage}>
            <img
              src={
                galleryImages[0]
                  ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${galleryImages[0]}`
                  : "/default.jpg"
              }
              alt="Main"
            />
          </div>

          {/* Small Images Grid */}
          <div className={styles.smallImagesGrid}>
            {galleryImages.slice(1, 4).map((image, index) => (
              <div key={index} className={styles.smallImage}>
                <img
                  src={
                    image
                      ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${image}`
                      : "/default.jpg"
                  }
                  alt={`Gallery ${index + 1}`}
                />
              </div>
            ))}

            {/* "+ More" Overlay - Shows when more than 4 images exist */}
            {galleryImages.length > 4 && (
              <div className={styles.moreOverlay} onClick={openModal}>
                +{galleryImages.length - 4} More
              </div>
            )}
          </div>
        </div>

        {/* Affordable Div */}
        <div className={styles.affordable}>
          <div className={styles.content}>
            {/* Title Section */}
            <div className={styles.leftsideaffordable}>
              <h2 className={styles.title}>
                {RENTAL_RESALE_DATA.title || "Affordable Urban House"}
              </h2>

              {/* Features Section */}
              <div className={styles.features}>
                <div className={styles.feature}>
                  <Image
                    src={require("/assets/img/badicon.png")}
                    alt="Bed Icon"
                    width={24}
                    height={24}
                  />
                  <span>{RENTAL_RESALE_DATA.bedroom} Br</span>
                </div>
                <div className={styles.feature}>
                  <Image
                    src={require("/assets/img/bathicon.png")}
                    alt="Bath Icon"
                    width={24}
                    height={24}
                  />
                  <span>{RENTAL_RESALE_DATA.bathroom} Ba</span>
                </div>
                <div className={styles.feature}>
                  <Image
                    src={require("/assets/img/areavector.png")}
                    alt="Area Icon"
                    width={24}
                    height={24}
                  />
                  <span>{RENTAL_RESALE_DATA.sq_ft} Sq.Ft</span>
                </div>
                <div className={styles.feature}>
                  <Image
                    src={require("/assets/img/warehousevector.png")}
                    alt="Car Icon"
                    width={24}
                    height={24}
                  />
                  <span>{RENTAL_RESALE_DATA.garage} Gr</span>
                </div>
              </div>
            </div>
            {/* Prices Section */}
            <div className={styles.prices}>
              <div className={styles.price}>
                <span className={styles.currency}>USD</span>
                <span className={styles.amount}>
                  {RENTAL_RESALE_DATA.amount.amount}
                </span>
              </div>
              <div className={styles.price}>
                <span className={styles.currency}>UAD</span>
                <span className={styles.amount}>
                  {RENTAL_RESALE_DATA.amount.amount_dirhams}
                </span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className={styles.addresses}>
            {flattenedAddresses.map((address, index) => (
              <p key={index}>{address}</p>
            ))}
          </div>
        </div>
        {/* description Div */}
        <div className={`container ${styles.description}`}>
          <h1>Description</h1>
          <div className="row">
            <div className="col-md-8">
              <div className={styles.body}>
                <pre className={styles.descriptionText}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: RENTAL_RESALE_DATA.description
                    }}
                  />
                </pre>
              </div>

              <div className={styles.details}>
                <h3>Details</h3>
                <span className={styles.details_line}></span>
                <div className={styles.detailsGrid}>
                  {RENTAL_RESALE_DATA.details.map((detail, index) => (
                    <div className={styles.detailItem} key={index}>
                      <span className={styles.detailLabel}>{detail.title}</span>
                      <span className={styles.detailValue}>{detail.info}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-md-4">
              {/* Contact Information Section */}
              <div className={styles.sharediv}>
                <div className={styles.content_sharediv}>
                  <div className={styles.imageContainer_share}>
                    <img
                      src={
                        RENTAL_RESALE_DATA.agent_photo
                          ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${RENTAL_RESALE_DATA.agent_photo}`
                          : "/default.jpg"
                      }
                      alt={RENTAL_RESALE_DATA.title}
                      className={styles.agentImage}
                    />
                  </div>
                  <div className={styles.textContainer}>
                    <h2 className={styles.name}>
                      {RENTAL_RESALE_DATA.agent_title}
                    </h2>
                    <span className={styles.role}>
                      {RENTAL_RESALE_DATA.agent_status}
                    </span>
                    <span className={styles.languages}>
                      Speaks: {languagesString}
                    </span>
                    <span className={styles.email}>example@gmail.com</span>
                  </div>
                </div>

                <div className={styles.contactButtons}>
                  <button
                    className={styles.contactBtnperson}
                    onClick={() => {
                      const formattedPhone = `+971${RENTAL_RESALE_DATA.agent_call.replace(
                        /\D/g,
                        ""
                      )}`;
                      window.location.href = `tel:${formattedPhone}`;
                    }}
                  >
                    Call
                  </button>
                  <button
                    className={styles.whatsappperson}
                    onClick={() => {
                      const formattedWhatsApp = `+971${RENTAL_RESALE_DATA.agent_whatsapp.replace(
                        /\D/g,
                        ""
                      )}`;
                      window.open(
                        `https://wa.me/${formattedWhatsApp}`,
                        "_blank"
                      );
                    }}
                  >
                    WhatsApp
                  </button>
                </div>
                <button className={styles.shareButton}>
                  <Image
                    src={require("../../assets/img/shareicon.png")}
                    alt="shareicon"
                  />{" "}
                  Share this Listing
                </button>
              </div>

              {/* Location Map Section */}
              <div className={styles.sidevabarlocation}>
                <Map location_link={RENTAL_RESALE_DATA.location_link} />
              </div>

              {/* Regulatory Information Section */}
              <div className={styles.sidebarqr}>
                <h2 className={styles.sectionTitle}>Regulatory Information</h2>
                <div className={styles.regulatoryInfo}>
                  {/* QR Code */}
                  <img
                    src={
                      RENTAL_RESALE_DATA.qr_photo
                        ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${RENTAL_RESALE_DATA.qr_photo}`
                        : "/default.jpg"
                    }
                    alt="QR Code"
                    className={styles.qrCode}
                  />

                  {/* Reference and DLD Permit Number */}
                  <div className={styles.infoText}>
                    <span className={styles.infoItem}>
                      <span className={styles.Referenceblue}>Reference | </span>
                      <span className={styles.Referenceblue_value}>
                        {RENTAL_RESALE_DATA.reference}
                      </span>
                    </span>
                    <span className={styles.infoItem}>
                      <span className={styles.DLD}>DLD Permit Number |</span>
                      <span className={styles.DLD_value}>
                        {RENTAL_RESALE_DATA.dld_permit_number}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.contactButton}>
                <button> Contact Us</button>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.amenities_section}>
          <h4>Amenities</h4>
          <div className={styles.amenitiesGrid}>
            {normalizedAmenities.map((amenity, index) => (
              <div key={index} className={styles.amenityItem}>
                {amenity}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.sameArea_poperies}>
          <h4>Properties available in the same area</h4>
          <div className={styles.propertyGrid}>
            {/* Manual Property Card */}
            <div
              className={styles.propertyCardLink}
              onClick={() => handleReadMore("manual-slug")} // Replace "manual-slug" with your desired slug
              style={{ cursor: "pointer" }} // Add pointer cursor for better UX
            >
              <div className={styles.propertyCard}>
                <div className={styles.imageContainer}>
                  <Image
                    src={defaultImage} // Use a static image (e.g., defaultImage)
                    alt="Luxury Apartment in Dubai Marina" // Static alt text
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.propertyImage}
                    priority
                    unoptimized
                  />
                  <span className={styles.exclusive}>Exclusive</span>{" "}
                  {/* Optional: Add exclusive badge */}
                </div>

                <div className={styles.propertyInfo}>
                  <h3 className={styles.propertytitle}>
                    Luxury Apartment in Dubai Marina
                  </h3>{" "}
                  {/* Static title */}
                  <p className={styles.location}>Dubai Marina, Dubai</p>{" "}
                  {/* Static location */}
                  <div className={styles.features}>
                    <div className={styles.feature}>
                      <Image
                        src={require("/assets/img/badicon.png")}
                        alt="Bed Icon"
                        width={24}
                        height={24}
                      />
                      <span>3 Br</span> {/* Static bedroom count */}
                    </div>
                    <div className={styles.feature}>
                      <Image
                        src={require("/assets/img/bathicon.png")}
                        alt="Bath Icon"
                        width={24}
                        height={24}
                      />
                      <span>2 Ba</span> {/* Static bathroom count */}
                    </div>
                    <div className={styles.feature}>
                      <Image
                        src={require("/assets/img/areavector.png")}
                        alt="Area Icon"
                        width={24}
                        height={24}
                      />
                      <span>1,500 Sq.Ft</span> {/* Static area */}
                    </div>
                    <div className={styles.feature}>
                      <Image
                        src={require("/assets/img/warehousevector.png")}
                        alt="Car Icon"
                        width={24}
                        height={24}
                      />
                      <span>1 Gr</span> {/* Static garage count */}
                    </div>
                  </div>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>USD 1,500,000</span>{" "}
                    {/* Static USD price */}
                    <span className={styles.price}>AED 5,500,000</span>{" "}
                    {/* Static AED price */}
                    <div className={styles.actions}>
                      <button className={styles.actionButton}>
                        <StarIcon /> {/* Star icon for favorite */}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={styles.propertyCardLink}
              onClick={() => handleReadMore("manual-slug")} // Replace "manual-slug" with your desired slug
              style={{ cursor: "pointer" }} // Add pointer cursor for better UX
            >
              <div className={styles.propertyCard}>
                <div className={styles.imageContainer}>
                  <Image
                    src={defaultImage} // Use a static image (e.g., defaultImage)
                    alt="Luxury Apartment in Dubai Marina" // Static alt text
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.propertyImage}
                    priority
                    unoptimized
                  />

                  {/* Optional: Add exclusive badge */}
                </div>

                <div className={styles.propertyInfo}>
                  <h3 className={styles.propertytitle}>
                    Luxury Apartment in Dubai Marina
                  </h3>{" "}
                  {/* Static title */}
                  <p className={styles.location}>Dubai Marina, Dubai</p>{" "}
                  {/* Static location */}
                  <div className={styles.features}>
                    <div className={styles.feature}>
                      <Image
                        src={require("/assets/img/badicon.png")}
                        alt="Bed Icon"
                        width={24}
                        height={24}
                      />
                      <span>3 Br</span> {/* Static bedroom count */}
                    </div>
                    <div className={styles.feature}>
                      <Image
                        src={require("/assets/img/bathicon.png")}
                        alt="Bath Icon"
                        width={24}
                        height={24}
                      />
                      <span>2 Ba</span> {/* Static bathroom count */}
                    </div>
                    <div className={styles.feature}>
                      <Image
                        src={require("/assets/img/areavector.png")}
                        alt="Area Icon"
                        width={24}
                        height={24}
                      />
                      <span>1,500 Sq.Ft</span> {/* Static area */}
                    </div>
                    <div className={styles.feature}>
                      <Image
                        src={require("/assets/img/warehousevector.png")}
                        alt="Car Icon"
                        width={24}
                        height={24}
                      />
                      <span>1 Gr</span> {/* Static garage count */}
                    </div>
                  </div>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>USD 1,500,000</span>{" "}
                    {/* Static USD price */}
                    <span className={styles.price}>AED 5,500,000</span>{" "}
                    {/* Static AED price */}
                    <div className={styles.actions}>
                      <button className={styles.actionButton}>
                        <StarIcon /> {/* Star icon for favorite */}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={styles.propertyCardLink}
              onClick={() => handleReadMore("manual-slug")} // Replace "manual-slug" with your desired slug
              style={{ cursor: "pointer" }} // Add pointer cursor for better UX
            >
              <div className={styles.propertyCard}>
                <div className={styles.imageContainer}>
                  <Image
                    src={defaultImage} // Use a static image (e.g., defaultImage)
                    alt="Luxury Apartment in Dubai Marina" // Static alt text
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.propertyImage}
                    priority
                    unoptimized
                  />

                  {/* Optional: Add exclusive badge */}
                </div>

                <div className={styles.propertyInfo}>
                  <h3 className={styles.propertytitle}>
                    Luxury Apartment in Dubai Marina
                  </h3>{" "}
                  {/* Static title */}
                  <p className={styles.location}>Dubai Marina, Dubai</p>{" "}
                  {/* Static location */}
                  <div className={styles.features}>
                    <div className={styles.feature}>
                      <Image
                        src={require("/assets/img/badicon.png")}
                        alt="Bed Icon"
                        width={24}
                        height={24}
                      />
                      <span>3 Br</span> {/* Static bedroom count */}
                    </div>
                    <div className={styles.feature}>
                      <Image
                        src={require("/assets/img/bathicon.png")}
                        alt="Bath Icon"
                        width={24}
                        height={24}
                      />
                      <span>2 Ba</span> {/* Static bathroom count */}
                    </div>
                    <div className={styles.feature}>
                      <Image
                        src={require("/assets/img/areavector.png")}
                        alt="Area Icon"
                        width={24}
                        height={24}
                      />
                      <span>1,500 Sq.Ft</span> {/* Static area */}
                    </div>
                    <div className={styles.feature}>
                      <Image
                        src={require("/assets/img/warehousevector.png")}
                        alt="Car Icon"
                        width={24}
                        height={24}
                      />
                      <span>1 Gr</span> {/* Static garage count */}
                    </div>
                  </div>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>USD 1,500,000</span>{" "}
                    {/* Static USD price */}
                    <span className={styles.price}>AED 5,500,000</span>{" "}
                    {/* Static AED price */}
                    <div className={styles.actions}>
                      <button className={styles.actionButton}>
                        <StarIcon /> {/* Star icon for favorite */}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={styles.propertyCardLink}
              onClick={() => handleReadMore("manual-slug")} // Replace "manual-slug" with your desired slug
              style={{ cursor: "pointer" }} // Add pointer cursor for better UX
            >
              <div className={styles.propertyCard}>
                <div className={styles.imageContainer}>
                  <Image
                    src={defaultImage} // Use a static image (e.g., defaultImage)
                    alt="Luxury Apartment in Dubai Marina" // Static alt text
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.propertyImage}
                    priority
                    unoptimized
                  />

                  {/* Optional: Add exclusive badge */}
                </div>

                <div className={styles.propertyInfo}>
                  <h3 className={styles.propertytitle}>
                    Luxury Apartment in Dubai Marina
                  </h3>{" "}
                  {/* Static title */}
                  <p className={styles.location}>Dubai Marina, Dubai</p>{" "}
                  {/* Static location */}
                  <div className={styles.features}>
                    <div className={styles.feature}>
                      <Image
                        src={require("/assets/img/badicon.png")}
                        alt="Bed Icon"
                        width={24}
                        height={24}
                      />
                      <span>3 Br</span> {/* Static bedroom count */}
                    </div>
                    <div className={styles.feature}>
                      <Image
                        src={require("/assets/img/bathicon.png")}
                        alt="Bath Icon"
                        width={24}
                        height={24}
                      />
                      <span>2 Ba</span> {/* Static bathroom count */}
                    </div>
                    <div className={styles.feature}>
                      <Image
                        src={require("/assets/img/areavector.png")}
                        alt="Area Icon"
                        width={24}
                        height={24}
                      />
                      <span>1,500 Sq.Ft</span> {/* Static area */}
                    </div>
                    <div className={styles.feature}>
                      <Image
                        src={require("/assets/img/warehousevector.png")}
                        alt="Car Icon"
                        width={24}
                        height={24}
                      />
                      <span>1 Gr</span> {/* Static garage count */}
                    </div>
                  </div>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>USD 1,500,000</span>{" "}
                    {/* Static USD price */}
                    <span className={styles.price}>AED 5,500,000</span>{" "}
                    {/* Static AED price */}
                    <div className={styles.actions}>
                      <button className={styles.actionButton}>
                        <StarIcon /> {/* Star icon for favorite */}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <SubscribeSection />
      </div>

      {/* Modal - Shows all images */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Gallery Modal"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <div className={styles.modalContent}>
          <button onClick={closeModal} className={styles.closeButton}>
            &times;
          </button>
          <div className={styles.modalImages}>
            {galleryImages.map((image, index) => (
              <img
                key={index}
                src={
                  image
                    ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${image}`
                    : "/default.jpg"
                }
                alt={`Gallery ${index + 1}`}
                className={styles.modalImage}
              />
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RentalResaleShow;
