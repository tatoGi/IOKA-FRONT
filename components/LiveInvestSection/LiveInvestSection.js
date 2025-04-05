import React, { useState } from "react";
import Image from "next/image";
import styles from "./LiveInvestSection.module.css";
import homeBanner from "../../assets/img/homeBanner.jpg";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const LiveInvestSection = ({ sectionDataTwo }) => {
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
    url: item.url
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

  return (
    <section className={styles.liveInvestSection}>
      <div className={styles.topWhiteDiv}></div>
      <div className="container">
        <div className="row">
          <div className={`${styles.content} col-md-6`}>
            <h4>{additionalFields.subtitle}</h4>
            <h2>{additionalFields.title}</h2>
            <p>{additionalFields.title_2}</p>
            <button className={styles.contactBtn}>Contact Us</button>
          </div>
          <div className={`${styles.sliderContainer} col-md-6`}>
            {isMobile ? (
              <Swiper
                spaceBetween={24}
                slidesPerView={1}
                className={styles.mobileSwiper}
              >
                {sliderData.map((item) => (
                  <SwiperSlide key={item.id}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={
                          item.image
                            ? `${
                                process.env.NEXT_PUBLIC_API_URL
                              }/storage/${decodeImageUrl(item.image)}`
                            : homeBanner
                        }
                        alt="Dubai Property"
                        width={320}
                        height={222}
                        style={{ objectFit: "cover", borderRadius: "16px" }}
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
                    >
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          src={
                            item.image
                              ? `${
                                  process.env.NEXT_PUBLIC_API_URL
                                }/storage/${decodeImageUrl(item.image)}`
                              : homeBanner
                          }
                          alt="Dubai Property"
                          width={364}
                          height={364}
                          style={{ objectFit: "cover", borderRadius: "16px" }}
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
              ‹
            </button>
            <button
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={next}
            >
              ›
            </button>
          </div>
        </div>
      </div>
      <div className={styles.topWhiteDiv}></div>
      <div className={styles.bottomWhiteDiv}></div>
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
            <h3>
              {item.number}
              {item.suffix}
            </h3>
            <p>{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LiveInvestSection;
