import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import styles from "./LiveInvestSection.module.css";

const LiveInvestSection = () => {
  return (
    <div className={styles.liveInvest}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.subtitle}>Live. Invest. Grow</div>
          <h2 className={styles.title}>
            DUBAI - YOUR PARTNER FOR ACCELERATED GROWTH
          </h2>
          <button className={styles.contactBtn}>Contact Us</button>
        </div>

        <div className={styles.imageGallery}>
          <Swiper
            modules={[Navigation, EffectCoverflow]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={2}
            initialSlide={1}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 1.5,
              slideShadows: false
            }}
            navigation={{
              prevEl: `.${styles.swiperNavigation}`,
              nextEl: `.${styles.swiperNavigationNext}`
            }}
            loop={true}
            className={styles.swiper}
          >
            <SwiperSlide className={styles.swiperSlide}>
              <Image
                src={require("../../assets/img/homeBanner.jpg")}
                alt="Property"
                width={500}
                height={300}
                className={styles.image}
                priority
              />
            </SwiperSlide>
            <SwiperSlide className={styles.swiperSlide}>
              <Image
                src={require("../../assets/img/homeBanner.jpg")}
                alt="Property"
                width={500}
                height={300}
                className={styles.image}
              />
            </SwiperSlide>
            <SwiperSlide className={styles.swiperSlide}>
              <Image
                src={require("../../assets/img/homeBanner.jpg")}
                alt="Property"
                width={500}
                height={300}
                className={styles.image}
              />
            </SwiperSlide>
          </Swiper>

          <div className={styles.navigationButtons}>
            <button className={styles.swiperNavigation}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className={styles.swiperNavigationNext}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 18L15 12L9 6"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>★</span>
          <div className={styles.statContent}>
            <span className={styles.statNumber}>86K</span>
            <span className={styles.statLabel}>RESALE PROPERTYIES</span>
          </div>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>⌂</span>
          <div className={styles.statContent}>
            <span className={styles.statNumber}>32K</span>
            <span className={styles.statLabel}>OFF PLAN PROPERTIES</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveInvestSection;
