import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import style from "./OffplaneShow.module.css";
import Image from "next/image";
import dynamic from "next/dynamic";
import baseimage from "../../assets/img/blogimage.png";
import ContactForm from "../contactForm/ContactForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faTimes, faChevronLeft, faChevronRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import success from "../../assets/img/succsess.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ShareIcons from "../ShareIcons/ShareIcons";

const Map = dynamic(() => import("./Map"), { ssr: false });

const decodeImageUrl = (url) => {
  return decodeURIComponent(url);
};

const getImageUrl = (path) => {
  if (!path) return baseimage;

  try {
    const decodedPath = decodeImageUrl(path);

    // For development environment
    if (process.env.NODE_ENV === 'development') {
      // If the path already includes 'storage/', remove it to avoid duplication
      const cleanPath = decodedPath.replace(/^storage\//, '');

      // If it's already a full URL, return as is
      if (decodedPath.startsWith('http://') || decodedPath.startsWith('https://')) {
        return decodedPath;
      }

      // Construct the URL
      const baseUrl = 'http://127.0.0.1:8000';
      const finalUrl = `${baseUrl}/storage/${cleanPath}`;


      return finalUrl;
    }

    // For production environment
    const cleanPath = decodedPath.replace(/^storage\//, '');
    return `${process.env.NEXT_PUBLIC_API_URL}/storage/${cleanPath}`;
  } catch (error) {
    console.error('Error processing image URL:', {
      error,
      path,
      decodedPath: decodeImageUrl(path)
    });
    return baseimage;
  }
};

const MobileSlider = ({ images, type, openGalleryModal, offplanData }) => {
  const handleClick = (e, index) => {
    e.preventDefault();
    openGalleryModal(images, index);
  };

  return (
    <Swiper
      className={style.swiper}
      slidesPerView={'auto'}
    >
      {images.map((image, index) => (
        <SwiperSlide key={index} className={style.swiperSlide}>
          <div onClick={(e) => handleClick(e, index)} style={{ cursor: 'pointer', height: '100%' }}>
            <Image
              src={getImageUrl(image)}
              alt={offplanData?.offplan?.alt_texts?.[type]?.[index] || `${type} Image ${index + 1}`}
              width={400}
              height={300}
              className={style.exteriorimage}
              priority={index === 0}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

const PropertySlider = ({ properties, decodeImageUrl }) => {
  return (
    <Swiper
      className={style.swiper}
      slidesPerView={'auto'}
   
    >
      {properties.map((property) => (
        <SwiperSlide
          key={property.id}
          className={`${style.swiperSlideForProperties}`}
        >
          <div className={style.propertyCard}>
            <div className={style.imageContainer}>
              <Image
                src={
                  property.main_photo
                    ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(property.main_photo)}`
                    : baseimage
                }
                alt={property.alt_texts?.main_photo || property.title || `Property ${index + 1}`}
                width={280}
                height={200}
                className={style.sectionImage}
              />
              <div className={style.overlay}>
                <div className={style.propertyName}>{property.title}</div>
                <a href={`/offplan/${property.slug}`} className={style.arrowLink} title={`View details for ${property.title}`}>
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
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentGallery, setCurrentGallery] = useState([]);
  const [copyAlertoffplan, setCopyAlertoffplan] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const openGalleryModal = (images, startIndex) => {
    setCurrentGallery(images);
    setCurrentImageIndex(startIndex);
    setGalleryModalOpen(true);
  };

  const closeGalleryModal = () => {
    setGalleryModalOpen(false);
    setCurrentImageIndex(0);
  };
  // Share functionality now handled by ShareIcons component
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % currentGallery.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + currentGallery.length) % currentGallery.length);
  };

  const handleKeyDown = (e) => {
    if (!galleryModalOpen) return;

    switch (e.key) {
      case 'ArrowLeft':
        prevImage();
        break;
      case 'ArrowRight':
        nextImage();
        break;
      case 'Escape':
        closeGalleryModal();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [galleryModalOpen, currentGallery]);

  function safeParse(json) {
    if (!json) return [];
    try {
      if (Array.isArray(json)) return json;
      if (typeof json === 'string') {
        const parsed = JSON.parse(json);
        return Array.isArray(parsed) ? parsed : [];
      }
      // Handle case where json might be a single string
      if (typeof json === 'string' && json.trim()) {
        return [json];
      }
      return [];
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      return [];
    }
  }

  const features = safeParse(offplanData.offplan.features);
  const amenities = safeParse(offplanData.offplan.amenities);
  const nearbyPlaces = safeParse(offplanData.offplan.near_by);
  const exteriorGallery = Array.isArray(offplanData?.offplan?.exterior_gallery)
    ? offplanData.offplan.exterior_gallery
    : safeParse(offplanData?.offplan?.exterior_gallery);

  const interiorGallery = Array.isArray(offplanData?.offplan?.interior_gallery)
    ? offplanData.offplan.interior_gallery
    : safeParse(offplanData?.offplan?.interior_gallery);

  const shortDescription = offplanData.offplan.description?.slice(0, 300) || '';

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const renderGalleryImage = (image, index, isMain = false) => {
    if (!image) return null;

    const imageUrl = getImageUrl(image);
    const galleryType = showExterior ? 'exterior' : 'interior';
    const caption = `${offplanData?.offplan?.title || ''} - ${galleryType} Image ${index + 1}`;

    const handleClick = (e) => {
      e.preventDefault();
      const gallery = showExterior ? exteriorGallery : interiorGallery;
      openGalleryModal(gallery, index);
    };

    return (
      <div
        key={`gallery-${image}-${index}`}
        className={style.galleryItem}
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      >
        <Image
          src={imageUrl}
          alt={offplanData.offplan.alt_texts?.[`${galleryType}_gallery`]?.[index] || caption}
          width={400}
          height={300}
          className={style.exteriorimage}
          priority={isMain}
          loading={isMain ? "eager" : "lazy"}
          onError={(e) => {
            console.error('Error loading image:', {
              url: imageUrl,
              originalPath: image,
              index,
              galleryType,
              isMain
            });
            e.target.src = baseimage;
          }}
        />
      </div>
    );
  };

  return (
    <>
  {copyAlertoffplan && (
        <div className={style.copyAlertoffplan}>Link copied to clipboard!</div>
      )}
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
          alt={offplanData.offplan.alt_texts?.banner_photo || "Banner Image"}
          fill
          priority
          sizes="100vw"
          className={style.bannerImage}
          quality={90}
        />
        <div className={style.bannerContent}>
          <h1>{offplanData.offplan.banner_title}</h1>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        <div className="row">
          <div className="col-md-7">
            <div className={style.propertyDetails}>
              <h2>{offplanData.offplan.title}</h2>
              <div className={style.features}>
                <div className={`${style.feature} ${style.textEllipsis}`}>
                  <Image
                    src={require("/assets/img/bad.svg")}
                    alt="Bed Icon"
                    width={24}
                    height={24}
                  />
                  <span>{offplanData.offplan?.bedroom || 0} Br</span>
                </div>
                <div className={`${style.feature} ${style.textEllipsis}`}>
                  <Image
                    src={require("/assets/img/bath.svg")}
                    alt="Bath Icon"
                    width={24}
                    height={24}
                  />
                  <span>{offplanData.offplan?.bathroom || 0} Ba</span>
                </div>
                <div className={`${style.feature} ${style.textEllipsis}`}>
                  <Image
                    src={require("/assets/img/place.svg")}
                    alt="Area Icon"
                    width={24}
                    height={24}
                  />
                  <span>{offplanData.offplan?.sq_ft || 0} Sq.m</span>
                </div>
                <div className={`${style.feature} ${style.textEllipsis}`}>
                  <Image
                    src={require("/assets/img/garage.svg")}
                    alt="Garage Icon"
                    width={24}
                    height={24}
                  />
                  <span>{offplanData.offplan?.garage || 0} Gr</span>
                </div>
              </div>
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
                    __html: offplanData.offplan.description || ''
                  }}
                />
              </div>
            </div>
          </div>
         
          {/* Right Sidebar */}
          <div className="col-md-5">
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
                  alt={offplanData.offplan.alt_texts?.agent_image || "Agent Image"}
                  width={100}
                  height={100}
                  priority={false}
                  loading="lazy"
                />
                <div className={style.consultantDetails}>
                  <span className={style.consultantName}>
                    {offplanData.offplan.agent_title}
                  </span>
                  <span className={style.languages}>
                    Speaks: {Array.isArray(offplanData.offplan.agent_languages) ? offplanData.offplan.agent_languages.join(', ') : 'Not specified'}
                  </span>
                  <span className={style.email}>{offplanData.offplan.agent_email}</span>
                </div>
              </div>
              <div className={style.contactButtons}>
                <button
                  className={style.contactBtnperson}
                  onClick={() => window.location.href = `tel:+971${offplanData.offplan.agent_telephone.replace(/\D/g, "")}`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.15312 0.769455C4.9125 0.188205 4.27812 -0.12117 3.67188 0.0444546L0.921875 0.794455C0.378125 0.944455 0 1.4382 0 2.0007C0 9.73195 6.26875 16.0007 14 16.0007C14.5625 16.0007 15.0563 15.6226 15.2063 15.0788L15.9563 12.3288C16.1219 11.7226 15.8125 11.0882 15.2312 10.8476L12.2312 9.59758C11.7219 9.38508 11.1313 9.53195 10.7844 9.96008L9.52188 11.5007C7.32188 10.4601 5.54063 8.67883 4.5 6.47883L6.04063 5.21945C6.46875 4.86945 6.61562 4.28195 6.40312 3.77258L5.15312 0.77258V0.769455Z" fill="#FFFFFF" />
                  </svg>
                  Call
                </button>
                <button
                  className={style.whatsappperson}
                  onClick={() => window.open(`https://wa.me/+971${offplanData.offplan.agent_whatsapp.replace(/\D/g, "")}`, "_blank")}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.9031 2.03437C10.5938 0.721875 8.85 0 6.99687 0C3.17187 0 0.059375 3.1125 0.059375 6.9375C0.059375 8.15938 0.378125 9.35312 0.984375 10.4062L0 14L3.67812 13.0344C4.69063 13.5875 5.83125 13.8781 6.99375 13.8781H6.99687C10.8188 13.8781 14 10.7656 14 6.94063C14 5.0875 13.2125 3.34687 11.9031 2.03437ZM6.99687 12.7094C5.95937 12.7094 4.94375 12.4312 4.05937 11.9062L3.85 11.7812L1.66875 12.3531L2.25 10.225L2.1125 10.0063C1.53437 9.0875 1.23125 8.02812 1.23125 6.9375C1.23125 3.75938 3.81875 1.17188 7 1.17188C8.54062 1.17188 9.9875 1.77187 11.075 2.8625C12.1625 3.95312 12.8313 5.4 12.8281 6.94063C12.8281 10.1219 10.175 12.7094 6.99687 12.7094ZM10.1594 8.39062C9.9875 8.30313 9.13438 7.88438 8.975 7.82812C8.81563 7.76875 8.7 7.74062 8.58438 7.91562C8.46875 8.09062 8.1375 8.47813 8.03438 8.59688C7.93438 8.7125 7.83125 8.72812 7.65938 8.64062C6.64062 8.13125 5.97188 7.73125 5.3 6.57812C5.12188 6.27187 5.47812 6.29375 5.80937 5.63125C5.86562 5.51562 5.8375 5.41563 5.79375 5.32812C5.75 5.24062 5.40313 4.3875 5.25938 4.04063C5.11875 3.70312 4.975 3.75 4.86875 3.74375C4.76875 3.7375 4.65312 3.7375 4.5375 3.7375C4.42188 3.7375 4.23438 3.78125 4.075 3.95312C3.91562 4.12813 3.46875 4.54688 3.46875 5.4C3.46875 6.25313 4.09063 7.07813 4.175 7.19375C4.2625 7.30938 5.39687 9.05937 7.1375 9.8125C8.2375 10.2875 8.66875 10.3281 9.21875 10.2469C9.55313 10.1969 10.2437 9.82812 10.3875 9.42188C10.5312 9.01562 10.5312 8.66875 10.4875 8.59688C10.4469 8.51875 10.3313 8.475 10.1594 8.39062Z" fill="#FFFFFF" />
                  </svg>

                  WhatsApp
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <button className={style.sharelist} onClick={() => setShareOpen(!shareOpen)}>
                  <svg width="16" height="14" style={{ marginRight: "8px" }} viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg" >
                  <path d="M9.59375 0.0881295C9.23438 0.247505 9 0.60688 9 1.00063V3.00063H5.5C2.4625 3.00063 0 5.46313 0 8.50063C0 12.0413 2.54688 13.6225 3.13125 13.9413C3.20937 13.985 3.29688 14.0006 3.38438 14.0006C3.725 14.0006 4 13.7225 4 13.385C4 13.1506 3.86562 12.935 3.69375 12.7756C3.4 12.4975 3 11.9506 3 11.0006C3 9.34438 4.34375 8.00063 6 8.00063H9V10.0006C9 10.3944 9.23125 10.7538 9.59375 10.9131C9.95625 11.0725 10.375 11.0069 10.6687 10.7444L15.6687 6.24438C15.8781 6.05375 16 5.785 16 5.50063C16 5.21625 15.8812 4.9475 15.6687 4.75688L10.6687 0.25688C10.375 -0.0087454 9.95312 -0.0743705 9.59375 0.0881295Z" fill="#0A273B" />
                </svg>
                  Share this Listing
                </button>
                {shareOpen && (
                  <div style={{ position: 'absolute', zIndex: 100, top: '100%', right: 0 }}>
                    <ShareIcons 
                      url={typeof window !== 'undefined' ? window.location.href : ''} 
                      title={offplanData?.offplan?.title || 'Check out this property'}
                    />
                  </div>
                )}
              </div>
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
                  alt={offplanData.offplan.qr_photo_alt || "QR Code"}
                  width={180}
                  height={180}
                />
                <div className={style.qrbodyContent}>
                  <div
                    className={style.qrText}
                    dangerouslySetInnerHTML={{ __html: offplanData.offplan.qr_text }}
                  />
                  {!isMobile && 
                    <div className={style.qrButtons}>
                      {offplanData.offplan.download_brochure && (
                        <button
                          className={style.downloadBtn}
                          onClick={() => window.open(offplanData.offplan.download_brochure, "_blank")}
                        >
                          Download Brochure
                        </button>
                      )}
                      {offplanData.offplan.enquiry_now && (
                        <button className={style.enquireBtn}>Enquire now</button>
                      )}
                    </div>
                  }
                </div>
              </div>
              {isMobile && (
                <div className={style.qrButtons}>
                  {offplanData.offplan.download_brochure && (
                    <button className={style.downloadBtn}>Download Brochure</button>
                  )}
                  {offplanData.offplan.enquiry_now && (
                    <button className={style.enquireBtn}>Enquire now</button>
                  )}
                </div>
              )}
            </div>

            {/* Contact Modal */}
            <div className={style.contactButton}>
              <button className={style.contactBtn} onClick={openModal}>
                Contact Us
              </button>
              {isModalOpen && (
                <div className={style.modalOverlay}>
                  <div className={`${style.modalContent} container`}>
                    <button className={style.closeButton} onClick={closeModal}>
                      <span>&times;</span>
                    </button>
                    <ContactForm pageTitle="Offplan Page" />
                  </div>
                </div>
              )}
            </div>
            
            
          </div>
         
        </div>
        <div className={style.shareIconsWrapper}>
              <ShareIcons 
                url={typeof window !== 'undefined' ? window.location.href : ''} 
                title={offplanData?.offplan?.title || 'Check out this property'}
              />
            </div>
      </div>
     
        <div className={style.line}></div>

        {/* Building Section */}
        {isMobile ? (
        <div className={style.buildingSection}>
          <div className="row">
            <div className="col-12 col-md-6">
              <Image
                src={
                  offplanData.offplan.main_photo
                    ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(offplanData.offplan.main_photo)}`
                    : baseimage
                }
                alt={offplanData.offplan.main_photo_alt || offplanData.offplan.title}
                width={737}
                height={461}
                className={style.buildingImage}
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
            <div className="col-12 col-md-6">
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
                      {amenity.icon ? (
                        <Image 
                          src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${amenity.icon}`} 
                          alt={amenity.name} 
                          width={20} 
                          height={20} 
                        />
                      ) : (
                        <Image src={success} alt="success" width={20} height={20} />
                      )}
                      {amenity.name}
                    </li>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
          ) : (
            <div className="container">
               <div className={style.buildingSection}>
          <div className="row">
            <div className="col-12 col-md-6">
              <Image
                src={
                  offplanData.offplan.main_photo
                    ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(offplanData.offplan.main_photo)}`
                    : baseimage
                }
                alt={offplanData.offplan.main_photo_alt || offplanData.offplan.title}
                width={737}
                height={461}
                className={style.buildingImage}
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
            <div className="col-12 col-md-6">
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
                      {amenity.icon ? (
                        <Image 
                          src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${amenity.icon}`} 
                          alt={amenity.name} 
                          width={20} 
                          height={20} 
                        />
                      ) : (
                        <Image src={success} alt="success" width={20} height={20} />
                      )}
                      {amenity.name}
                    </li>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
            </div>
          )}
        {/* Location Section */}
        {!isMobile ? (
        <div className="container">
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
        ) : (
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
        )}


      {/* Gallery Section */}
      <div className={style.exteriorInteriorSection}>
        <div className={`container ${style.sectionHeader}`}>
          <h3>{offplanData.offplan.title}</h3>
          <div className={style.switcher}>
            <button
              className={`${style.switchButton} ${showExterior ? style.active : ""}`}
              onClick={() => setShowExterior(true)}
            >
              EXTERIOR
            </button>
            <button
              className={`${style.switchButton} ${!showExterior ? style.active : ""}`}
              onClick={() => setShowExterior(false)}
            >
              INTERIOR
            </button>
          </div>
        </div>

        <div className={style.content}>
          {showExterior ? (
            <div className={style.exteriorSection}>
              <div className="container">
                <div className="row d-none d-md-flex">
                  {exteriorGallery.map((image, index) => (
                    <div key={index} className="col-md-3 mb-4">
                      {renderGalleryImage(image, index, index === 0)}
                    </div>
                  ))}
                </div>
                <div className="d-md-none">
                  <MobileSlider
                    images={exteriorGallery}
                    type="exterior"
                    openGalleryModal={openGalleryModal}
                    offplanData={offplanData}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className={style.interiorSection}>
              <div className="container">
                <div className="row d-none d-md-flex">
                  {interiorGallery.map((image, index) => (
                    <div key={index} className="col-md-3 mb-4">
                      {renderGalleryImage(image, index, index === 0)}
                    </div>
                  ))}
                </div>
                <div className="d-md-none">
                  <MobileSlider
                    images={interiorGallery}
                    type="interior"
                    openGalleryModal={openGalleryModal}
                    offplanData={offplanData}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Other Properties */}
      <div className="container mb-5">
        <span className={style.sectionTitle}>Other Properties</span>
        <div className="row d-none d-md-flex">
          {offplanData.lastAddedOffplans.map((property) => (
            <div className={`col-md-3 ${style.propertyCardCol}`} key={property.id}>
              <div className={style.propertyCard}>
                <div className={style.imageContainer}>
                  <Image
                    src={
                      property.main_photo
                        ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(property.main_photo)}`
                        : baseimage
                    }
                    alt={property.main_photo_alt || property.title}
                    width={300}
                    height={200}
                    className={style.sectionImage}
                  />
                  <div className={style.overlay}>
                    <div className={style.propertyName}>{property.title}</div>
                    <a
                      href={`/offplan/${property.slug}`}
                      className={style.arrowLink}
                      title={`View details for ${property.title}`}
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

      {/* Custom Gallery Modal */}
      {galleryModalOpen && (
        <div className={style.galleryModal} onClick={closeGalleryModal}>
          <div className={style.galleryModalContent} onClick={e => e.stopPropagation()}>
            <button
              className={style.galleryCloseButton}
              onClick={closeGalleryModal}
              aria-label="Close gallery"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <button
              className={style.galleryNavButton}
              style={{ left: '20px' }}
              onClick={prevImage}
              aria-label="Previous image"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            <div className={style.galleryImageContainer}>
              {currentGallery[currentImageIndex] && (
                <Image
                  src={getImageUrl(currentGallery[currentImageIndex])}
                  alt={`Gallery Image ${currentImageIndex + 1}`}
                  fill
                  className={style.galleryModalImage}
                  priority
                  sizes="(max-width: 768px) 100vw, 80vw"
                />
              )}
            </div>

            <button
              className={style.galleryNavButton}
              style={{ right: '20px' }}
              onClick={nextImage}
              aria-label="Next image"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>

            <div className={style.galleryCounter}>
              {currentImageIndex + 1} / {currentGallery.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OffplanShow;