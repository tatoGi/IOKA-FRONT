import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

// import required modules
import { FreeMode, Pagination } from "swiper/modules";
import Link from "next/link";
import Image from "next/image";

import { PARTNER_API } from "../../routes/apiRoutes";
const decodeImageUrl = (url) => {
  return decodeURIComponent(url);
};
const PartnersSection = () => {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    fetch(PARTNER_API)
      .then(response => response.json())
      .then(data => setPartners(data))
      .catch(error => console.error('Error fetching partners:', error));
  }, []);

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
            {partners.map((partner, index) => (
              <SwiperSlide key={index}>
                <Link href={partner.url} className="partners-slider-item">
                  <Image 
                    src={partner.image ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(partner.image)}` : homeBanner} 
                    alt={partner.title} 
                    width={200} 
                    height={100} 
                  />
                  <div className="partner-title">{partner.title}</div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default PartnersSection;
