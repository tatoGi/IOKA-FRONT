import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import style from "./OffplaneShow.module.css";
import Image from "next/image";
import dynamic from "next/dynamic";
import baseimage from "../../assets/img/blogimage.png";
import ContactForm from "../contactForm/ContactForm";
import SubscribeSection from "../SubscribeSection/SubscribeSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import success from "../../assets/img/succsess.svg";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Map = dynamic(() => import("./Map"), { ssr: false });

const SwiperComponent = dynamic(
  () =>
    import("swiper/react").then((mod) => {
      import("swiper/css");
      import("swiper/css/navigation");
      import("swiper/css/pagination");
      return { default: mod.Swiper };
    }),
  { ssr: false }
);

const decodeImageUrl = (url) => {
  return decodeURIComponent(url);
};

const SwiperSlideComponent = dynamic(
  () => import("swiper/react").then((mod) => ({ default: mod.SwiperSlide })),
  { ssr: false }
);

const MobileSlider = ({ images, type, decodeImageUrl }) => {
  return (
    <Swiper slidesPerView="auto" spaceBetween={12} className={style.swiper}>
      {images.map((image, index) => (
        <SwiperSlide key={index} className={style.swiperSlide}>
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(image)}`}
            alt={`${type} Image ${index + 1}`}
            width={280}
            height={200}
            className={style.exteriorimage}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

const PropertySlider = ({ properties, decodeImageUrl }) => {
  return (
    <Swiper
      slidesPerView="auto"
      spaceBetween={12}
      className={style.swiper}
      style={{ overflow: "hidden" }}
    >
      {properties.map((property) => (
        <SwiperSlide
          key={property.id}
          className={style.swiperSlide}
          style={{ width: "280px" }}
        >
          <div className={style.propertyCard}>
            <div className={style.imageContainer}>
              <Image
                src={
                  property.main_photo
                    ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(property.main_photo)}`
                    : baseimage
                }
                alt={property.title}
                width={280}
                height={200}
                className={style.sectionImage}
              />
              <div className={style.overlay}>
                <div className={style.propertyName}>{property.title}</div>
                <a href={`/offplan/${property.slug}`} className={style.arrowLink}>
                  <FontAwesomeIcon icon={faAngleRight} />
                </a>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

const OffplanShow = ({ offplanData }) => {
  const router = useRouter();
  const { id } = router.query;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showExterior, setShowExterior] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  function safeParse(json) {
    if (Array.isArray(json)) return json;
    if (!json) return [];
    try {
      return typeof json === 'string' ? JSON.parse(json) : [];
    } catch (e) {
      console.error('Failed to parse:', json);
      return [];
    }
  }

  const features = safeParse(offplanData.offplan.features);
  const amenities = safeParse(offplanData.offplan.amenities);
  const nearbyPlaces = safeParse(offplanData.offplan.near_by);
  const exteriorGallery = safeParse(offplanData.offplan.exterior_gallery);
  const interiorGallery = safeParse(offplanData.offplan.interior_gallery);
  const shortDescription = offplanData.offplan.description?.slice(0, 300) || '';

  useEffect(() => {
    Fancybox.bind("[data-fancybox='gallery']", {
      Thumbs: { type: "classic" },
      Toolbar: {
        display: {
          left: ["infobar"],
          middle: ["zoomIn", "zoomOut", "toggle1to1", "rotateCCW", "rotateCW"],
          right: ["slideshow", "thumbs", "close"]
        }
      },
      Animation: { zoom: { opacity: "auto" } }
    });

    return () => Fancybox.destroy();
  }, [showExterior]);

  const toggleReadMore = () => setIsExpanded(!isExpanded);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
          alt={offplanData.offplan.title}
          fill
          priority
          sizes="100vw"
          className={style.bannerImage}
        />
        <div className={style.bannerContent}>
          <h1>{offplanData.offplan.title}</h1>
        </div>
      </div>

      {/* Main Content */}
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

          {/* Right Sidebar */}
          <div className="col-md-5 p-0">
            {/* Agent Card */}
            <div className={style.qrCard}>
              <div className={style.personalInfo}>
                <Image
                  src={
                    offplanData.offplan.agent_image
                      ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(
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
                  onClick={() => window.location.href = `tel:+971${offplanData.offplan.agent_telephone.replace(/\D/g, "")}`}
                >
                  Call
                </button>
                <button
                  className={style.whatsappperson}
                  onClick={() => window.open(`https://wa.me/+971${offplanData.offplan.agent_whatsapp.replace(/\D/g, "")}`, "_blank")}
                >
                  WhatsApp
                </button>
              </div>
              <button className={style.sharelist}>Share this Listing</button>
            </div>

            {/* QR Card */}
            <div className={style.qrCardmodern}>
              <h3>{offplanData.offplan.qr_title}</h3>
              <div className={style.qrbody}>
                <Image
                  src={
                    offplanData.offplan.qr_photo
                      ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(
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
                    className={style.qrText}
                    dangerouslySetInnerHTML={{ __html: offplanData.offplan.qr_text }}
                  />
                  <div className={style.qrButtons}>
                    <button
                      className={style.downloadBtn}
                      onClick={() => window.open(offplanData.offplan.download_brochure, "_blank")}
                    >
                      Download Brochure
                    </button>
                    <button className={style.enquireBtn}>Enquire now</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Modal */}
            <div className={style.contactButton}>
              <button className={style.contactBtn} onClick={openModal}>
                Contact Us
              </button>
              {isModalOpen && (
                <div className={style.modalOverlay}>
                  <div className={style.modalContent}>
                    <button className={style.closeButton} onClick={closeModal}>
                      &times;
                    </button>
                    <ContactForm pageTitle="Offplan Page"/>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={style.line}></div>

        {/* Building Section */}
        <div className={style.buildingSection}>
          <div className="row">
            <div className="col-md-6">
              <Image
                src={
                  offplanData.main_photo
                    ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(offplanData.main_photo)}`
                    : baseimage
                }
                alt={offplanData.offplan.title}
                width={600}
                height={400}
                className={style.buildingImage}
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
            <div className="col-md-6">
              <div className={style.featuresSection}>
                <h3>Features</h3>
                <ul className={style.featuresList}>
                  {features.map((feature, index) => (
                    <li key={index}>
                      <Image src={success} alt="success" /> {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={style.amenitiesSection}>
                <h3>Amenities</h3>
                <div className={style.amenitiesList}>
                  {amenities.map((amenity, index) => (
                    <li key={index}>
                      <Image src={success} alt="success" /> {amenity}
                    </li>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className={style.locationSection}>
          <h3>Location</h3>
          <div className={style.mapWrapper}>
            <div className={style.mapContainer}>
              <Map address={offplanData.offplan.map_location} />
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

      {/* Gallery Section */}
      <div className={style.exteriorInteriorSection}>
        <div className={`container ${style.sectionHeader}`}>
          <h3>{offplanData.offplan.title}</h3>
          <div className={style.switcher}>
            <button
              className={`${style.switchButton} ${showExterior ? style.active : ""}`}
              onClick={() => setShowExterior(true)}
            >
              Exterior
            </button>
            <button
              className={`${style.switchButton} ${!showExterior ? style.active : ""}`}
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
                <div className="row d-none d-md-flex">
                  {exteriorGallery.slice(0, 8).map((image, index) => (
                    <div
                      key={index}
                      className="col-md-3 mb-3"
                      data-fancybox="gallery"
                      data-src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(image)}`}
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(image)}`}
                        alt="Exterior Image"
                        width={300}
                        height={200}
                        className={style.exteriorimage}
                      />
                    </div>
                  ))}
                </div>
                <div className="d-md-none">
                  <MobileSlider
                    images={exteriorGallery}
                    type="Exterior"
                    decodeImageUrl={decodeImageUrl}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className={style.interiorSection}>
              <div className="container">
                <div className="row d-none d-md-flex">
                  {interiorGallery.slice(0, 8).map((image, index) => (
                    <div
                      key={index}
                      className="col-md-3 mb-3"
                      data-fancybox="gallery"
                      data-src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(image)}`}
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(image)}`}
                        alt="Interior Image"
                        width={300}
                        height={200}
                        className={style.exteriorimage}
                      />
                    </div>
                  ))}
                </div>
                <div className="d-md-none">
                  <MobileSlider
                    images={interiorGallery}
                    type="Interior"
                    decodeImageUrl={decodeImageUrl}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Other Properties */}
      <div className="container">
        <span className={style.sectionTitle}>Other Properties</span>
        <div className="row d-none d-md-flex">
          {offplanData.lastAddedOffplans.map((property) => (
            <div className="col-md-3" key={property.id}>
              <div className={style.propertyCard}>
                <div className={style.imageContainer}>
                  <Image
                    src={
                      property.main_photo
                        ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(property.main_photo)}`
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
                      <FontAwesomeIcon icon={faAngleRight} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="d-md-none">
          <PropertySlider
            properties={offplanData.lastAddedOffplans}
            decodeImageUrl={decodeImageUrl}
          />
        </div>
      </div>

      <SubscribeSection />
    </>
  );
};

export default OffplanShow;