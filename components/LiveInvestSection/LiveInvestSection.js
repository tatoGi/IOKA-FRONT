import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "./LiveInvestSection.module.css";
import homeBanner from "../../assets/img/homeBanner.jpg";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const LiveInvestSection = ({ sectionDataTwo, navigationData = [] }) => {
  const [activeSlide, setActiveSlide] = useState(1);
  const additionalFields = sectionDataTwo?.additional_fields || {
    slider_images: [],
    rolling_numbers: [],
    subtitle: "",
    title: "",
    title_2: ""
  };
  const sliderData = additionalFields.slider_images.map((item, index) => ({
    id: index + 1,
    image: item.image,
    url: item.url,
    alt_text: item.alt_text || "Dubai Property"
  }));
  const decodeImageUrl = (url) => {
    return decodeURIComponent(url);
  };
  const next = () => {
    setActiveSlide((prev) => (prev === sliderData.length - 1 ? 0 : prev + 1));
  };

  const prev = () => {
    setActiveSlide((prev) => (prev === 0 ? sliderData.length - 1 : prev - 1));
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
  const router = useRouter();

  // Find contact page
  const contactPage = navigationData.find(page => page.type_id === 3 && page.active === 1);
  const contactSlug = contactPage ? `/${contactPage.slug}` : '/contact';

  const handleContactClick = () => {
    router.push(contactSlug);
  };

  return (
    <section className={styles.liveInvestSection}>
      {/* <div className={styles.topWhiteDiv}></div> */}
      <div className="container">
        <div className="row">
          <div className={`${styles.content} col-md-6`}>
            <h2>{additionalFields.subtitle}</h2>
            <h1>{additionalFields.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: sectionDataTwo.description }}></div>
            <button className={styles.contactBtn} onClick={handleContactClick}>Contact Us</button>
          </div>
          <div className={`${styles.sliderContainer} col-md-6`}>
            {isMobile ? (
              <Swiper
              className="mySwiper"
              >
                {sliderData.map((item) => (
                  <SwiperSlide key={item.id}>
                    <a
                      href={item.url}
                      target="_blank"
                      title={`View ${item.alt_text || 'Dubai Property'}`}
                    >
                      <Image
                        src={
                          item.image
                            ? `${
                                process.env.NEXT_PUBLIC_API_URL
                              }/storage/${decodeImageUrl(item.image)}`
                            : homeBanner
                        }
                        alt={item.alt_text || "Dubai Property"}
                        title={item.alt_text || "Dubai Property"}
                        width={320}
                        height={222}
                        style={{
                          objectFit: "cover",
                          borderRadius: "16px",
                          backgroundColor: "#fff" // Add a background color to prevent ghosting
                        }}
                        loading="lazy"
                      />
                    </a>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className={styles.sliderWrapper}>
                {sliderData.map((item, i) => {
                  let positionClass =
                    i === activeSlide
                      ? styles.center
                      : i === (activeSlide + 1) % sliderData.length
                      ? styles.right
                      : styles.left;

                  return (
                    <div
                      key={item.id}
                      className={`${styles.slide} ${positionClass}`}
                      style={{ backgroundColor: "#fff" }} // Add background color here as well
                    >
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`View ${item.alt_text || 'Dubai Property'}`}
                      >
                        <Image
                          src={
                            item.image
                              ? `${
                                  process.env.NEXT_PUBLIC_API_URL
                                }/storage/${decodeImageUrl(item.image)}`
                              : homeBanner
                          }
                          alt={item.alt_text || "Dubai Property"}
                          title={item.alt_text || "Dubai Property"}
                          width={364}
                          height={364}
                          style={{
                            objectFit: "cover",
                            borderRadius: "16px",
                            backgroundColor: "#fff" // Add a background color to prevent ghosting
                          }}
                          loading="lazy"
                        />
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
            <button
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={prev}
            >
              <svg width="13" height="22" viewBox="0 0 13 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.941016 9.94023C0.355078 10.5262 0.355078 11.4777 0.941016 12.0637L9.94102 21.0637C10.527 21.6496 11.4785 21.6496 12.0645 21.0637C12.6504 20.4777 12.6504 19.5262 12.0645 18.9402L4.12383 10.9996L12.0598 3.05898C12.6457 2.47305 12.6457 1.52148 12.0598 0.935547C11.4738 0.349609 10.5223 0.349609 9.93633 0.935547L0.936329 9.93555L0.941016 9.94023Z" fill="#8FE3DC"/>
            </svg>

            </button>
            <button
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={next}
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="22" viewBox="0 0 13 22" fill="none">
<path d="M12.059 12.0598C12.6449 11.4738 12.6449 10.5223 12.059 9.93633L3.05898 0.936328C2.47305 0.350391 1.52148 0.350391 0.935547 0.936328C0.349609 1.52227 0.349609 2.47383 0.935547 3.05977L8.87617 11.0004L0.940234 18.941C0.354296 19.527 0.354296 20.4785 0.940234 21.0645C1.52617 21.6504 2.47773 21.6504 3.06367 21.0645L12.0637 12.0645L12.059 12.0598Z" fill="#8FE3DC"/>
</svg>
            </button>
          </div>
        </div>
      </div>
      {/* <div className={styles.topWhiteDiv}></div> */}
      {/* <div className={styles.bottomWhiteDiv}></div> */}
      <div className={`container ${ styles.statItems }`}>
        {additionalFields.rolling_numbers.map((item, index) => (
          <div
            key={index}
            className={styles.statItem}
            style={{
              marginRight:
                index === 0 && !isMobile ? "106px" : "0"
            }}
          >
            <h2>
              {item.number}
              {item.suffix}
            </h2>
            <p>{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LiveInvestSection;
