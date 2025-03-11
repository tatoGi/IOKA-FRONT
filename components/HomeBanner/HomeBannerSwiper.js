import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import '@/styles/globals.css';

import { Pagination, Autoplay } from "swiper/modules";
import Link from "next/link";
import styles from "./HomeBanner.module.css";
// import homeImg from '../../assets/img/homeBanner.jpg'

const HomeBannerSwiper = () => {
  return (
    <Swiper
      pagination={{
        clickable: true,
        bulletActiveClass: `${styles["swiper-pagination-bullet-active"]}`
      }}
      modules={[Pagination, Autoplay]}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false
      }}
      className={`mySwiper ${styles["swiper-container"]}`}
    >
      <SwiperSlide className={styles["swiper-item-relative"]}>
        <Link href={"#"} className={styles["in-sw-item"]}>
          <div className={styles["banner-content"]}>
            <div className={styles["text-b-i"]}>IOKA Development</div>
            <h1>
            Inspired by Bugatti Hypercars, this Architectural Masterpiece
            </h1>
          </div>
          <div className={styles["swiper-item-img"]}>
            <Image
              src={require("../../assets/img/homeBanner.jpg")}
              alt="homeBanner"
              priority
              quality={100}
            />
          </div>
        </Link>
      </SwiperSlide>
      <SwiperSlide className={styles["swiper-item-relative"]}>
        <Link href={"#"} className={styles["in-sw-item"]}>
          <div className={styles["banner-content"]}>
            <div className={styles["text-b-i"]}>IOKA Development</div>
            <h1>
            Inspired by Bugatti Hypercars, this Architectural Masterpiece
            </h1>
          </div>
          <div className={styles["swiper-item-img"]}>
            <Image
              src={require("../../assets/img/homeBanner.jpg")}
              alt="homeBanner"
            />
          </div>
        </Link>
      </SwiperSlide>
    </Swiper>
  );
};

export default HomeBannerSwiper;
