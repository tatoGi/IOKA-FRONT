import React from "react";
import stylesearch from "./styles.module.css"; // Should be correct path
import offplanStyles from '../Offplan/Offplan.module.css';
import defaultImage from "../../assets/img/default.webp";
import Image from "next/image";
import { BsWhatsapp } from "react-icons/bs";
import callVector from "../../assets/img/call.svg";
import agentifno from "../../assets/img/agentinfo.png";
import stylesdeveloper from "../Developer/Developer.module.css";
import stylesrental from "../Rental_Resale/RentalList.module.css";
import { HiOutlineMail } from "react-icons/hi";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPhone,
  FaWhatsapp,
  FaSearch
} from "react-icons/fa";
// const decodeImageUrl = (url) => {
//     return decodeURIComponent(url);
//   };
const SearchHomeResult = () => {
  return (
    <section className={stylesearch.searchhome}>
      <div className="container">
        <h1>155 Results</h1>
        <section className={stylesearch.offplan_section}>
          <div className={stylesearch.header}>
            <div className={stylesearch.result}>
              <span className={stylesearch.result_text}>Off plan</span>
              <span className={stylesearch.count}>(15)</span>
            </div>
            <div className={stylesearch.see_all}>
              <a href="#" className={stylesearch.see_all_link}>
                See All
              </a>
            </div>
          </div>
          <div className={offplanStyles.cardContainer}>
            <div
              className={offplanStyles.propertyCardLink}
              style={{ cursor: "pointer" }}
            >
              <div className={offplanStyles.propertyCard}>
                <div className={offplanStyles.imageContainer}>
                  <Image
                    src={defaultImage}
                    alt="Default Property Image"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={offplanStyles.propertyImage}
                    priority
                    unoptimized
                  />
                  <span className={offplanStyles.exclusive}>Exclusive</span>
                </div>

                <div className={offplanStyles.propertyInfo}>
                  <h3 className={`${offplanStyles.title} ${offplanStyles.textEllipsis}`}>
                    Property Title
                  </h3>
                  <p
                    className={`${offplanStyles.location} ${offplanStyles.textEllipsis}`}
                  >
                    Property Location
                  </p>

                  <div className={offplanStyles.features}>
                    <div className={`${offplanStyles.feature} ${offplanStyles.textEllipsis}`}>
                      <Image
                        src={require("/assets/img/bad.svg")}
                        alt="Bed Icon"
                        width={24}
                        height={24}
                      />
                      <span>X Br</span>
                    </div>
                    <div
                      className={`${offplanStyles.feature} ${offplanStyles.textEllipsis}`}
                    >
                      <Image
                        src={require("/assets/img/bath.svg")}
                        alt="Bath Icon"
                        width={24}
                        height={24}
                      />
                      <span>X Ba</span>
                    </div>
                    <div
                      className={`${offplanStyles.feature} ${offplanStyles.textEllipsis}`}
                    >
                      <Image
                        src={require("/assets/img/place.svg")}
                        alt="Area Icon"
                        width={24}
                        height={24}
                      />
                      <span>XXXX Sq.Ft</span>
                    </div>
                    <div
                      className={`${offplanStyles.feature} ${offplanStyles.textEllipsis}`}
                    >
                      <Image
                        src={require("/assets/img/garage.svg")}
                        alt="Car Icon"
                        width={24}
                        height={24}
                      />
                      <span>X Gr</span>
                    </div>
                  </div>
                  <div className={offplanStyles.priceRow}>
                    <span
                      className={`${offplanStyles.price} ${offplanStyles.textEllipsis}`}
                    >
                      USD X,XXX,XXX
                    </span>
                    <span
                      className={`${offplanStyles.price} ${offplanStyles.textEllipsis}`}
                    >
                      AED X,XXX,XXX
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={stylesearch.rental_section}>
          <div className={stylesearch.header}>
            <div className={stylesearch.result}>
              <span className={stylesearch.result_text}>Resale</span>
              <span className={stylesearch.count}>(15)</span>
            </div>
            <div className={stylesearch.see_all}>
              <a href="#" className={stylesearch.see_all_link}>
                See All
              </a>
            </div>
          </div>
          <div className={stylesrental.resaleList}>
            <div
              className={stylesrental.resaleCard}
              style={{ cursor: "pointer" }}
              onClick={() => console.log("Read more clicked")}
            >
              <div className={stylesrental.largeImage}>
                <Image
                  src={defaultImage}
                  alt="Sample Property"
                  style={{ objectFit: "cover" }}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 580px"
                />
              </div>

              <div className={stylesrental.smallImagesGrid}>
                <div className={stylesrental.smallImage}>
                  <Image
                    src={defaultImage}
                    alt="Gallery Image 1"
                    style={{ objectFit: "cover" }}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 40vw, 334px"
                  />
                </div>
                <div className={stylesrental.smallImage}>
                  <Image
                    src={defaultImage}
                    alt="Gallery Image 2"
                    style={{ objectFit: "cover" }}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 40vw, 334px"
                  />
                </div>
              </div>

              {/* Mobile view slider (you can hide/show with media queries if needed) */}
              <div className={stylesrental.mobileImageSlider}>
                <button
                  className={`${stylesrental.sliderArrow} ${stylesrental.prevArrow}`}
                  disabled
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M15 18L9 12L15 6"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div
                  className={stylesrental.slideContainer}
                  style={{ transform: "translateX(0%)" }}
                >
                  <div className={stylesrental.slide}>
                    <Image
                      src="/your-slide-image.jpg"
                      alt="Property Image 1"
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="100vw"
                      priority
                    />
                  </div>
                </div>

                <button
                  className={`${stylesrental.sliderArrow} ${stylesrental.nextArrow}`}
                  disabled
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 18L15 12L9 6"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div className={stylesrental.slideIndicators}>
                  <div className={`${stylesrental.indicator} ${stylesrental.active}`} />
                  <div className={stylesrental.indicator} />
                  <div className={stylesrental.indicator} />
                </div>
              </div>

              <div className={stylesrental.resaleContent}>
                <h4>Beautiful Family Villa</h4>
                <p className={stylesrental.resaleLocation}>Palm Jumeirah, Dubai</p>

                <div className="d-flex gap-2.5">
                  <div className={stylesrental.starting_price}>
                    <span>Starting Price</span>
                  </div>
                  <p className={stylesrental.resalePrice}>USD 1,200K</p>
                  <p className={stylesrental.resalePrice}>AED 4,500K</p>
                </div>

                <div className={stylesrental.resaleStats}>
                  <div className={stylesrental.statGroup}>
                    <Image
                      src={require("/assets/img/bad.svg")}
                      alt="Bedrooms"
                      width={16}
                      height={16}
                    />
                    <span>4 Br</span>
                  </div>
                  <div className={stylesrental.statSeparator}>|</div>
                  <div className={stylesrental.statGroup}>
                    <Image
                      src={require("/assets/img/bath.svg")}
                      alt="Bathrooms"
                      width={16}
                      height={16}
                    />
                    <span>3 Ba</span>
                  </div>
                  <div className={stylesrental.statSeparator}>|</div>
                  <div className={stylesrental.statGroup}>
                    <Image
                      src={require("/assets/img/place.svg")}
                      alt="SqFt"
                      width={16}
                      height={16}
                    />
                    <span>3200 Sq.Ft</span>
                  </div>
                  <div className={stylesrental.statSeparator}>|</div>
                  <div className={stylesrental.statGroup}>
                    <Image
                      src={require("/assets/img/garage.svg")}
                      alt="Garage"
                      width={16}
                      height={16}
                    />
                    <span>2 Gr</span>
                  </div>
                </div>

                <div className={stylesrental.resaleDetails}>
                  <p>Spacious living area</p>
                  <p>Private garden and pool</p>
                  <p>Close to the beach</p>
                </div>

                <div className={stylesrental.resaleFooter}>
                  <div className={stylesrental.agentInfo}>
                    <Image
                      src={agentifno}
                      alt="Agent"
                      width={40}
                      height={40}
                      className={stylesrental.agentImage}
                    />
                    <span>John Doe</span>
                  </div>
                  <div className={stylesrental.footerActions}>
                    <button className={stylesrental.footerButton}>
                      <BsWhatsapp size={20} color="#34C759" />
                      <span>WhatsApp</span>
                    </button>
                    <div className={stylesrental.footerSeparator}>|</div>
                    <button className={stylesrental.footerButton}>
                      <Image
                        src={callVector}
                        alt="Call"
                        width={16}
                        height={16}
                      />
                      <span>Call Us</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={stylesearch.developer_section}>
        <div className={stylesearch.header}>
            <div className={stylesearch.result}>
              <span className={stylesearch.result_text}>Developer</span>
              <span className={stylesearch.count}>(15)</span>
            </div>
            <div className={stylesearch.see_all}>
              <a href="#" className={stylesearch.see_all_link}>
                See All
              </a>
            </div>
          </div>
          <div className={stylesdeveloper.cardsContainer}>
            <div className={stylesdeveloper.cardWrapper}>
              <div className={stylesdeveloper.card}>
                <div className={stylesdeveloper.cardRow}>
                  {/* Image Section */}
                  <div className={stylesdeveloper.imageContainer}>
                    <Image
                      src={defaultImage}
                      alt="Sample Title"
                      width={400}
                      height={300}
                      className={stylesdeveloper.cardImage}
                      style={{ objectFit: "cover" }}
                    />
                    <div className={stylesdeveloper.imageNav}>
                      <button className={stylesdeveloper.prevButtonimage}>
                        <FaChevronLeft />
                      </button>
                      <button className={stylesdeveloper.nextButtonimage}>
                        <FaChevronRight />
                      </button>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className={stylesdeveloper.cardContent}>
                    <h2 className={stylesdeveloper.title}>Sample Title</h2>
                    <div className={stylesdeveloper.description}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html:
                            "<p>This is a static sample paragraph with <strong>HTML</strong> formatting.</p>"
                        }}
                      />
                    </div>

                    <div className={stylesdeveloper.communitiesSection}>
                      <h3 className={stylesdeveloper.communitiesTitle}>
                        Top Communities
                      </h3>
                      <div className={stylesdeveloper.communitiesList}>
                        <span className={stylesdeveloper.badge}>Downtown</span>
                        <span className={stylesdeveloper.badge}>Marina</span>
                        <span className={stylesdeveloper.badge}>Palm Jumeirah</span>
                      </div>
                    </div>

                    {/* Buttons Section */}
                    <div className={stylesdeveloper.buttonsSection}>
                      <div className={stylesdeveloper.contactButtons}>
                        <button
                          className={stylesdeveloper.call}
                          onClick={() =>
                            (window.location.href = "tel:+1234567890")
                          }
                        >
                          <FaPhone />
                          <span>Call</span>
                        </button>
                        <button
                          className={stylesdeveloper.whatsapp}
                          onClick={() =>
                            window.open("https://wa.me/1234567890", "_blank")
                          }
                        >
                          <FaWhatsapp />
                          <span>WhatsApp</span>
                        </button>
                      </div>

                      <button
                        className={stylesdeveloper.readMore}
                        onClick={() => alert("See More clicked!")}
                      >
                        See More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* You can duplicate the above block for more cards if needed */}
          </div>
        </section>
      </div>
    </section>
  );
};

export default SearchHomeResult;
