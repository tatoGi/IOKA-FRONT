import React, { useState } from "react";
import { useRouter } from "next/router";
import style from "./OffplaneShow.module.css";
import Image from "next/image";
import dynamic from "next/dynamic";
import baseimage from "../../assets/img/blogimage.png"; // Ensure this path is correct
import ContactForm from "../contactForm/ContactForm"; // Import the ContactForm component
import SubscribeSection from "../SubscribeSection/SubscribeSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

// Create a separate Map component to handle client-side rendering
const Map = dynamic(
  () => import("./Map"), // Create a new Map.js component
  { ssr: false }
);

const OffplanShow = ({ offplanData }) => {
  const router = useRouter();
  const { id } = router.query;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showExterior, setShowExterior] = useState(true);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const position = offplanData.offplan.map_location; // Dubai coordinates

  const features = offplanData.offplan.features
    ? JSON.parse(offplanData.offplan.features)
    : [];
    const amenities = offplanData.offplan.amenities
    ? JSON.parse(offplanData.offplan.amenities)
    : [];
  const nearbyPlaces = offplanData.offplan.near_by
    ? JSON.parse(offplanData.offplan.near_by)
    : [];

  const decodeImageUrl = (url) => {
    return decodeURIComponent(url);
  };
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };
  // Limit the description length before "Read More" button
  const shortDescription = offplanData.offplan.description.slice(0, 300); // Adjust length as needed
  return (
    <>
      {/* Banner Section */}
      <div className={`container ${style.offplanebanner}`}>
        <Image
          src={
            offplanData.offplan.banner_photo
              ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(
                  offplanData.offplan.banner_photo
                )}`
              : baseimage
          }
          alt="The Fifth Tower at JVC"
          fill
          priority
          sizes="100vw"
          className={style.bannerImage}
        />
        <div className={style.bannerContent}>
          <h1>{offplanData.offplan.title}</h1>
        </div>
      </div>

      {/* Main Content Inside Container */}
      <div className="container">
        <div className="row">
          <div className="col-md-7">
            <div className={style.propertyDetails}>
              <h2>{offplanData.offplan.title}</h2>
              <div className={style.pricing}>
                <span className={style.aedPricestart}>Starting Price:</span>
                <span className={style.aedPrice}>
                  AED {offplanData.offplan.amount_dirhams}
                </span>
                <span className={style.usdPrice}>
                  USD {offplanData.offplan.amount}
                </span>
              </div>
              <div className={style.description}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: isExpanded
                      ? offplanData.offplan.description
                      : `${shortDescription}...`
                  }}
                />
                <button className={style.readMore} onClick={toggleReadMore}>
                  {isExpanded ? "Read Less" : "Read More"}
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-5">
            <div className={style.qrCard}>
              <div className={style.personalInfo}>
                <Image
                  src={
                    offplanData.offplan.agent_image
                      ? `${
                          process.env.NEXT_PUBLIC_API_URL
                        }/storage/${decodeImageUrl(
                          offplanData.offplan.agent_image
                        )}`
                      : baseimage
                  }
                  alt={offplanData.offplan.agent_title}
                  width={100}
                  height={100}
                />
                <div className={style.consultantDetails}>
                  <span className={style.consultantName}>
                    {offplanData.offplan.agent_title}
                  </span>
                  <span className={style.languages}>
                    Speaks: English, Spanish, Arabic, French
                  </span>
                  <span className={style.email}>example@gmail.com</span>
                </div>
              </div>
              <div className={style.contactButtons}>
                <button
                  className={style.contactBtnperson}
                  onClick={() => {
                    const formattedPhone = `+971${offplanData.offplan.agent_telephone.replace(
                      /\D/g,
                      ""
                    )}`; // Example for UAE numbers
                    window.location.href = `tel:${formattedPhone}`;
                  }}
                >
                  Call
                </button>
                <button
                  className={style.whatsappperson}
                  onClick={() => {
                    const formattedWhatsApp = `+971${offplanData.offplan.agent_whatsapp.replace(
                      /\D/g,
                      ""
                    )}`; // Example for UAE numbers
                    window.open(`https://wa.me/${formattedWhatsApp}`, "_blank");
                  }}
                >
                  WhatsApp
                </button>
              </div>
              <button className={style.sharelist}>Share this Listing</button>
            </div>

            <div className={style.qrCardmodern}>
              <h3>{offplanData.offplan.qr_title}</h3>
              <div className={style.qrbody}>
                <Image
                  src={
                    offplanData.offplan.qr_photo
                      ? `${
                          process.env.NEXT_PUBLIC_API_URL
                        }/storage/${decodeImageUrl(
                          offplanData.offplan.qr_photo
                        )}`
                      : baseimage
                  }
                  alt="QR Code"
                  width={180}
                  height={180}
                  style={{ margin: "0 auto" }}
                />
                <div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: offplanData.offplan.qr_text
                    }}
                  />
                  <div className={style.qrButtons}>
                    <button
                      className={style.downloadBtn}
                      onClick={() =>
                        window.open(
                          offplanData.offplan.download_brochure,
                          "_blank"
                        )
                      }
                    >
                      Download Brochure
                    </button>
                    <button className={style.enquireBtn}>Enquire now</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Contact Us button at the bottom */}
            <div className={style.contactButton}>
              <button className={style.contactBtn} onClick={openModal}>
                Contact Us
              </button>
              {/* Modal */}
              {isModalOpen && (
                <div className={style.modalOverlay}>
                  <div className={style.modalContent}>
                    <button className={style.closeButton} onClick={closeModal}>
                      &times; {/* Close icon (X) */}
                    </button>
                    <ContactForm />{" "}
                    {/* Render the ContactForm inside the modal */}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={style.line}></div>
        <div className={style.buildingSection}>
          <div className="row">
            <div className="col-md-6">
              <Image
                src={
                  offplanData.main_photo
                    ? `${
                        process.env.NEXT_PUBLIC_API_URL
                      }/storage/${decodeImageUrl(offplanData.main_photo)}`
                    : baseimage
                }
                alt="The Fifth Tower Building"
                width={600}
                height={400}
                className={style.buildingImage}
                sizes="(max-width: 768px) 100vw, 600px"
                borderRadius="16nearbyPlacepx"
              />
            </div>
            <div className="col-md-6">
              <div className={style.featuresSection}>
                <h3>Features</h3>
                <ul className={style.featuresList}>
                  {features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div className={style.amenitiesSection}>
                <h3>Amenities</h3>
                <div className={style.amenitiesList}>
                  {amenities.map((amenity, index) => (
                    <li key={index}>{amenity}</li>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.locationSection}>
          <h3>Location</h3>
          <div className={style.mapWrapper}>
            <div className={style.mapContainer}>
              <Map address={offplanData.map_location} />
            </div>
            <button className={style.locationMapBtn}>Location Map</button>
          </div>

          <h4>Near by</h4>
          <div className={style.nearbyGrid}>
            {nearbyPlaces.map((place, index) => (
              <div key={index} className={style.nearbyColumn}>
                <div className={style.nearbyPlace}>
                  <span className={style.placeName}>{place.title}</span>
                  <span className={style.placeDistance}>{place.distance}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Exterior & Interior Section (Full Width) */}
      <div className={style.exteriorInteriorSection}>
        <div className={`container ${style.sectionHeader}`}>
          <h3>{offplanData.offplan.map_location}</h3>
          <div className={style.switcher}>
            <button
              className={`${style.switchButton} ${
                showExterior ? style.active : ""
              }`}
              onClick={() => setShowExterior(true)}
            >
              Exterior
            </button>
            <button
              className={`${style.switchButton} ${
                !showExterior ? style.active : ""
              }`}
              onClick={() => setShowExterior(false)}
            >
              Interior
            </button>
          </div>
        </div>

        <div className={style.content}>
          {showExterior ? (
            <div className={style.exteriorSection}>
              <div className="container">
                <div className="row">
                  {offplanData.offplan.exterior_gallery &&
                    JSON.parse(offplanData.offplan.exterior_gallery).map(
                      (image, index) => (
                        <div key={index} className="col-md-3 mb-3">
                          <Image
                            src={`${
                              process.env.NEXT_PUBLIC_API_URL
                            }/storage/${decodeImageUrl(image)}`}
                            alt="Exterior Image"
                            width={300}
                            height={200}
                            className={style.exteriorimage} // Apply border-radius via CSS
                          />
                        </div>
                      )
                    )}
                </div>
              </div>
            </div>
          ) : (
            <div className={style.interiorSection}>
              <div className="container">
                <div className="row">
                  {offplanData.offplan.interior_gallery &&
                    JSON.parse(offplanData.offplan.interior_gallery).map(
                      (image, index) => (
                        <div key={index} className="col-md-3 mb-3">
                          <Image
                            src={`${
                              process.env.NEXT_PUBLIC_API_URL
                            }/storage/${decodeImageUrl(image)}`}
                            alt="Interior Image"
                            width={300}
                            height={200}
                            className={style.exteriorimage}
                          />
                        </div>
                      )
                    )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* other & properties Section */}
      <div className="container">
        <div className="row">
          <span className={style.sectionTitle}>Other Properties</span>
          {offplanData.lastAddedOffplans.map((property, index) => (
            <div className="col-md-3" key={property.id}>
              <div className={style.propertyCard}>
                <div className={style.imageContainer}>
                  <Image
                    src={
                      property.main_photo
                        ? `${
                            process.env.NEXT_PUBLIC_API_URL
                          }/storage/${decodeImageUrl(property.main_photo)}`
                        : baseimage
                    }
                    alt={property.title}
                    width={300}
                    height={200}
                    className={style.sectionImage}
                  />
                  <div className={style.overlay}>
                    <div className={style.propertyName}>{property.title}</div>
                    <a
                      href={`/offplan/${property.slug}`}
                      className={style.arrowLink}
                    >
                      <FontAwesomeIcon icon={faAngleRight} /> {/* Use the FontAwesomeIcon component */}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SubscribeSection />
    </>
  );
};

export default OffplanShow;
