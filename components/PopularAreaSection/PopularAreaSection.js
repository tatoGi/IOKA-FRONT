import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Slider from "react-slick"; // Import react-slick
import "slick-carousel/slick/slick.css"; // Import slick styles
import "slick-carousel/slick/slick-theme.css"; // Import slick theme styles
import WhiteArrow from "../icons/WhiteArrow";
import axios from "axios";
import { NAVIGATION_MENU } from '@/routes/apiRoutes';

const PopularAreaSection = ({ sectionDataFour, navigationData: propNavigationData = [] }) => {
  
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [navigationData, setNavigationData] = useState(propNavigationData);
  useEffect(() => {
    const fetchNavigationData = async () => {
      try {
        const response = await axios.get(NAVIGATION_MENU);
        if (response.data && response.data.pages) {
          setNavigationData(response.data.pages);
        }
      } catch (err) {
        console.error('Error fetching navigation data:', err);
      }
    };

    fetchNavigationData();
  }, []);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Check if screen width is <= 768px
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize); // Add resize listener
    return () => window.removeEventListener("resize", handleResize); // Cleanup listener
  }, []);
  const decodeImageUrl = (url) => {
    return decodeURIComponent(url);
  };
 
  const handlePropertyTypeClick = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (!Array.isArray(navigationData)) {
      router.push('/');
      return;
    }

    const propertyType = type.toLowerCase();

    let navObj, prefix;
    if (propertyType === 'offplan') {
      navObj = navigationData.find(item => item.type_id === '4');
      prefix = '/offplan/';
    } else if (propertyType === 'rental' || propertyType === 'resale') {
      navObj = navigationData.find(item => item.type_id === '5');
      prefix = '/rentalResale/';
    }

    if (navObj && prefix) {
      router.push(`${prefix}${navObj.slug}`);
      return;
    }

    // fallback: try to match by title and go to /[slug]
    navObj = navigationData.find(item =>
      item.title && item.title.toLowerCase().replace(/\s/g, '') === propertyType.replace(/\s/g, '')
    );
    if (navObj) {
      router.push(`/${navObj.slug}`);
      return;
    }

    router.push('/');
  };

  const sectionData = sectionDataFour;
  const title = sectionData?.additional_fields?.title || "Default Title";
  const popularArea = sectionData?.additional_fields?.Add_Popular_Areas || [];

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: true,
    variableWidth: true, // Enable variable width for spacing
    responsive: [
      {
        breakpoint: 480,
        settings: {
          variableWidth: true, // Ensure spacing is applied in mobile
          adaptiveHeight: true // Adjust slider height dynamically
        }
      }
    ]
  };

  return (
    <div className="popular-area-section">
      <div className="container">
        <h2 className="popular-area-title">{title}</h2>
        {isMobile ? (
          <Slider {...sliderSettings} className="popular-area-slider">
            {popularArea.map((area, index) => (
              <div className="area-item" key={index}>
                <div className="area-image-wrapper">
                  <Image
                    src={
                      area.image
                        ? `${
                            process.env.NEXT_PUBLIC_API_URL
                          }/storage/${decodeImageUrl(area.image)}`
                        : area
                    }
                    width={400}
                    height={400}
                    alt={area.alt_text || "Popular Area"}
                    style={{ objectFit: 'cover' }}
                    quality={80}
                  />
                </div>
                <div className="off-relase-box">
                  {area.property_types?.map((type, typeIndex) => (
                    <div 
                      key={typeIndex} 
                      className="topic"
                      onClick={(e) => handlePropertyTypeClick(e, type)}
                      style={{ cursor: 'pointer' }}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </div>
                  ))}
                </div>
                <div className="area-title">
                  <div className="ar-title">{area.title}</div>
                  <Link href={area.redirect_link || "#"} target="_blank" className="arrow-box">
                    <WhiteArrow />
                  </Link>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
        
          <div className="popular-area-box">
            {popularArea.map((area, index) => (
            
              <div className="area-item" key={index}>
                <div className="area-content">
                  <div className="area-image-wrapper">
                    <Image
                      src={
                        area.image
                          ? `${
                              process.env.NEXT_PUBLIC_API_URL
                            }/storage/${decodeImageUrl(area.image)}`
                          : area
                      }
                      width={400}
                      height={400}
                      alt={area.alt_text || "Popular Area"}
                      style={{ objectFit: 'cover' }}
                      quality={80}
                    />
                  </div>
                  <div className="off-relase-box">
                    {area.property_types?.map((type, typeIndex) => (
                      <div 
                        key={typeIndex} 
                        className="topic"
                        onClick={(e) => handlePropertyTypeClick(e, type)}
                        style={{ cursor: 'pointer' }}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </div>
                    ))}
                  </div>
                  <div className="area-title">
                    <div className="ar-title">{area.title}</div>
                    <Link href={area.redirect_link || "#"} target="_blank" className="arrow-box">
                      <WhiteArrow />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularAreaSection;
