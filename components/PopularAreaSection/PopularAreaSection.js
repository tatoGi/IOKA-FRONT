import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Slider from "react-slick"; // Import react-slick
import "slick-carousel/slick/slick.css"; // Import slick styles
import "slick-carousel/slick/slick-theme.css"; // Import slick theme styles
import WhiteArrow from "../icons/WhiteArrow";

const PopularAreaSection = (sectionFourData) => {
  const [isMobile, setIsMobile] = useState(false);

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

  const sectionData = sectionFourData.sectionDataFour;
  const title = sectionData?.additional_fields?.title || "Default Title";
  const popularArea = sectionData?.additional_fields?.Add_Popular_Areas || [];

  // Enhanced slider settings for better mobile experience
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
    centerPadding: "20px",
    variableWidth: true, // Enable variable width for spacing
    responsive: [
      {
        breakpoint: 480,
        settings: {
          centerPadding: "10px",
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
                    alt={area.title || "Popular Area"}
                    layout="responsive"
                    objectFit="cover"
                  />
                </div>
                <div className="off-relase-box">
                  <div className="topic">Off Plan</div>
                  <div className="topic">Resale</div>
                </div>
                <div className="area-title">
                  <div className="ar-title">{area.title}</div>
                  <div className="arrow-box">
                    <WhiteArrow />
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <div className="popular-area-box">
            {popularArea.map((area, index) => (
              <Link href={"#"} className="area-item" key={index}>
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
                    alt={area.title || "Popular Area"}
                    layout="responsive"
                    objectFit="cover"
                  />
                </div>
                <div className="off-relase-box">
                  <div className="topic">Off Plan</div>
                  <div className="topic">Resale</div>
                </div>
                <div className="area-title">
                  <div className="ar-title">{area.title}</div>
                  <div className="arrow-box">
                    <WhiteArrow />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularAreaSection;
