import React, { useState } from "react";
import styles from "./Rental_Resale.show.module.css";
import Modal from "react-modal";
import Image from "next/image";
import SubscribeSection from "../SubscribeSection/SubscribeSection";
import defaultImage from "../../assets/img/default.webp"; // ✅ Correct import
import { StarIcon } from "../icons/PropertyIcons";
Modal.setAppElement("#__next");

const RentalResaleShow = ({ RENTAL_RESALE_DATA }) => {
  const galleryImages = JSON.parse(RENTAL_RESALE_DATA.gallery_images || "[]");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

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
            {RENTAL_RESALE_DATA.addresses.map((addresses, index) => (
              <p key={index}>{addresses}</p>
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
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Property ID:</span>
                    <span className={styles.detailValue}>HZ10</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Garage:</span>
                    <span className={styles.detailValue}>1</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Price:</span>
                    <span className={styles.detailValue}>$4,550,000</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Garage Size:</span>
                    <span className={styles.detailValue}>200 Sq Ft</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Property Size:</span>
                    <span className={styles.detailValue}>3400 Sq Ft</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Property Type:</span>
                    <span className={styles.detailValue}>Studio</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Bedrooms:</span>
                    <span className={styles.detailValue}>4</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Bathrooms:</span>
                    <span className={styles.detailValue}>2</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Property Status:</span>
                    <span className={styles.detailValue}>For Sale</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              {/* Contact Information Section */}
              <div className={styles.sharediv}>
                <div className={styles.content_sharediv}>
                  <h2 className={styles.name}>Shuan Van Der Linder</h2>
                  <span className={styles.role}>Palm Jameirah Consultant</span>
                  <span className={styles.languages}>
                    Speaks: English, Spanish, Arabic, French
                  </span>
                  <span className={styles.email}>example@gmail.com</span>
                </div>

                <div className={styles.contactButtons}>
                  <button className={styles.contactBtnperson}>Call</button>
                  <button className={styles.whatsappperson}>WhatsApp</button>
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
                <h2 className={styles.sectionTitle}>Location Map</h2>
                {/* Add your map component or image here */}
                <div className={styles.mapPlaceholder}>Map Placeholder</div>
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
                        L-233422
                      </span>
                    </span>
                    <span className={styles.infoItem}>
                      <span className={styles.DLD}>DLD Permit Number |</span>
                      <span className={styles.DLD_value}> 1118046093</span>
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
            {RENTAL_RESALE_DATA.amenities.map((amenities, index) => (
              <div className={styles.amenityItem}>{amenities}</div>
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
