import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import Link from "next/link";
import Image from "next/image";

import { PARTNER_API } from "../../routes/apiRoutes";

const decodeImageUrl = (url) => {
  return decodeURIComponent(url);
};

const PartnersSection = () => {
  const [partners, setPartners] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkResolution = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth > 768 && window.innerWidth <= 992);
    };

    // Initial check
    checkResolution();

    // Add event listener for window resize
    window.addEventListener('resize', checkResolution);

    // Cleanup event listener
    return () => window.removeEventListener('resize', checkResolution);
  }, []);

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
            spaceBetween={22}
            slidesPerView={4}
            pagination={{ clickable: true }}
            className="mySwiper partners-swp"
            breakpoints={{
              320: {
                slidesPerView: 2,
              },
              575: {
                slidesPerView: 3,
              },
              640: {
                slidesPerView: 4,
              },
              1024: {
                slidesPerView: 4,
              },
              1560: {
                slidesPerView: 6,
              },
              1920: {
                slidesPerView: 8,
              },
            }}
          >
            {partners.map((partner, index) => (
              <SwiperSlide key={index}>
                <div className="partner-item">
                  <Link href={partner.url} className="partners-slider-item">
                    <Image 
                      src={partner.image ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(partner.image)}` : '/assets/img/placeholder.png'} 
                      alt={partner.alt || 'Partner logo'}
                      width={80} 
                      height={80} 
                      style={{ borderRadius: '50%', objectFit: 'cover' }}
                    />
                    {isMobile && !isTablet && (
                      <div className="partner-title" style={{ textAlign: 'center' }}>
                        {partner.title}
                      </div>
                    )}
                  </Link>
                  {!isMobile && !isTablet && (
                    <div className="partner-title" style={{ textAlign: 'center' }}>
                      {partner.title}
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default PartnersSection;
