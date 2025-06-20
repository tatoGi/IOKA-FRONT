import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1920,
        settings: { slidesToShow: 8 }
      },
      {
        breakpoint: 1700,
        settings: { slidesToShow: 7 }
      },
      {
        breakpoint: 1560,
        settings: { slidesToShow: 6 }
      },
      {
        breakpoint: 1200,
        settings: { slidesToShow: 4 }
      },
      {
        breakpoint: 992,
        settings: { slidesToShow: 6 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 4 }
      },
      {
        breakpoint: 576,
        settings: { slidesToShow: 3 }
      }

     
    ]
  };

  return (
    <div className="partners-section">
      <div className="container">
        <div className="partners-title">Partners</div>
        <div className="partner-swiper-slide">
          <Slider {...settings}>
            {partners.map((partner, index) => (
              <div key={index} className="partner-item">
                <Link href={partner.url} className="partners-slider-item">
                  <Image 
                    src={partner.image ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(partner.image)}` : '/assets/img/placeholder.png'} 
                    alt={partner.alt || 'Partner logo'}
                    width={80} 
                    height={80} 
                    style={{ borderRadius: '50%', objectFit: 'cover' }}
                  />
                  {(isMobile || isTablet) && (
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
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default PartnersSection;
