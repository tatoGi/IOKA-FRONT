import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

// import required modules
import { FreeMode, Pagination } from "swiper/modules";
import Link from "next/link";
import Image from "next/image";

import PartnerImage from "../../assets/img/partner1.png";
import PartnerImageTwo from "../../assets/img/partner2.png";


const PartnersSection = () => {
  return (
    <div className="partners-section">
      <div className="container">
        <div className="partners-title">Partners</div>
        <div className="partner-swiper-slide">
          <Swiper
            slidesPerView={3}
            spaceBetween={22}
            freeMode={true}
            grabCursor={true} // Enables drag scrolling
            modules={[FreeMode, Pagination]}
            className="mySwiper partners-swp"
            breakpoints={{
              320: {
                slidesPerView: 2,
                spaceBetween: 10, 
              },
              575: {
                slidesPerView: 3,
                spaceBetween: 10, 
              },
              640: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 6,
                spaceBetween: 30,
              },
              1560: {
                slidesPerView: 8,
                spaceBetween: 40,
              },
            }}
          >
            <SwiperSlide>
              <Link href={"#"} className="partners-slider-item">
                <Image src={PartnerImage} alt="partner" />
              </Link>
            </SwiperSlide>
            <SwiperSlide>
              <Link href={"#"} className="partners-slider-item">
                <Image src={PartnerImageTwo} alt="partner" />
              </Link>
            </SwiperSlide>
            <SwiperSlide>
              <Link href={"#"} className="partners-slider-item">
                <Image src={PartnerImage} alt="partner" />
              </Link>
            </SwiperSlide>
            <SwiperSlide>
              <Link href={"#"} className="partners-slider-item">
                <Image src={PartnerImageTwo} alt="partner" />
              </Link>
            </SwiperSlide>
            <SwiperSlide>
              <Link href={"#"} className="partners-slider-item">
                <Image src={PartnerImage} alt="partner" />
              </Link>
            </SwiperSlide>
            <SwiperSlide>
              <Link href={"#"} className="partners-slider-item">
                <Image src={PartnerImageTwo} alt="partner" />
              </Link>
            </SwiperSlide>
            <SwiperSlide>
              <Link href={"#"} className="partners-slider-item">
                <Image src={PartnerImage} alt="partner" />
              </Link>
            </SwiperSlide>
            <SwiperSlide>
              <Link href={"#"} className="partners-slider-item">
                <Image src={PartnerImageTwo} alt="partner" />
              </Link>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default PartnersSection;
