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

  // Helper: decide how many slides should be visible based on viewport width
  const getBaseSlidesToShow = () => {
    if (typeof window === 'undefined') return 8;
    const width = window.innerWidth;
    if (width <= 576) return 3;
    if (width <= 768) return 4;
    if (width <= 992) return 6;
    if (width <= 1200) return 4;
    if (width <= 1560) return 6;
    if (width <= 1700) return 7;
    return 8;
  };

  // Ensure we never ask Slick to show more slides than we actually have
  const baseSlides = getBaseSlidesToShow();
  const slidesToShow = Math.max(1, Math.min(baseSlides, partners.length || baseSlides));

  const settings = {
    dots: false,
    infinite: partners.length > slidesToShow,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1920,
        settings: { slidesToShow: Math.max(1, Math.min(8, partners.length || 8)) }
      },
      {
        breakpoint: 1700,
        settings: { slidesToShow: Math.max(1, Math.min(7, partners.length || 7)) }
      },
      {
        breakpoint: 1560,
        settings: { slidesToShow: Math.max(1, Math.min(6, partners.length || 6)) }
      },
      {
        breakpoint: 1200,
        settings: { slidesToShow: Math.max(1, Math.min(4, partners.length || 4)) }
      },
      {
        breakpoint: 992,
        settings: { slidesToShow: Math.max(1, Math.min(6, partners.length || 6)) }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: Math.max(1, Math.min(4, partners.length || 4)) }
      },
      {
        breakpoint: 576,
        settings: { slidesToShow: Math.max(1, Math.min(3, partners.length || 3)) }
      }
    ]
  };

  return (
    <div className="partners-section">
      <div className="container">
        <div className="partners-title">Partners</div>
        <div className="partner-swiper-slide">
          <Slider {...settings}>
            {partners.map((partner, index) => {
              const PartnerContent = () => (
                <>
                  <Image 
                    src={
                      isMobile
                        ? (
                            partner.mobile_image
                              ? `${decodeImageUrl(partner.mobile_image)}`
                              : (partner.image ? `${decodeImageUrl(partner.image)}` : '/assets/img/placeholder.png')
                          )
                        : (partner.image ? `${decodeImageUrl(partner.image)}` : '/assets/img/placeholder.png')
                    }
                    alt={partner.alt || 'Partner logo'}
                    width={80} 
                    height={80} 
                    style={{ borderRadius: '50%', objectFit: 'cover' }}
                  />
                  {(isMobile || isTablet) && (
                    <div className="partner-title" style={{ textAlign: 'center' }}>
                      {partner.title || ''}
                    </div>
                  )}
                </>
              );

              return (
                <div key={index} className="partner-item">
                  {partner.url ? (
                    <Link href={partner.url} className="partners-slider-item">
                      <PartnerContent />
                    </Link>
                  ) : (
                    <div className="partners-slider-item non-clickable">
                      <PartnerContent />
                    </div>
                  )}
                  {!isMobile && !isTablet && (
                    <div className="partner-title" style={{ textAlign: 'center' }}>
                      {partner.title || ''}
                    </div>
                  )}
                </div>
              );
            })}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default PartnersSection;
