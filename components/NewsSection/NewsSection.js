import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

// import required modules
import { FreeMode, Pagination } from "swiper/modules";
import Link from "next/link";
import LeftArrow from "../icons/LeftArrow";
import Image from "next/image";

const NewsSection = ({ sectionSevenData }) => {
  const decodeImageUrl = (url) => {
    return decodeURIComponent(url);
  };
  return (
    <div className="news-section">
      <div className="container">
        <div className="news-header">
          <div className="news-title">{sectionSevenData?.title}</div>
          <Link
            href={sectionSevenData?.redirect_link || "#"}
            className="news-see-more"
          >
            SEE MORE
          </Link>
        </div>
        <div className="news-text">
          {sectionSevenData?.additional_fields?.subtitle}
        </div>
        <div className="news-slider-s">
          <Swiper
            slidesPerView={3}
            spaceBetween={24}
            freeMode={true}
            grabCursor={true} // Enables drag scrolling
            modules={[FreeMode, Pagination]}
            className="mySwiper partners-swp"
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 10
              },
              575: {
                slidesPerView: 1,
                spaceBetween: 24
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 24
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24
              },
              1560: {
                slidesPerView: 4,
                spaceBetween: 24
              }
            }}
          >
            {sectionSevenData?.additional_fields?.Recent_Articles?.map(
              (article, index) => (
                <SwiperSlide key={index}>
                  <div className="news-item">
                    <div className="n-image">
                      <Image
                        src={
                          article.image
                            ? `${
                                process.env.NEXT_PUBLIC_API_URL
                              }/storage/${decodeImageUrl(article.image)}`
                            : baseimage
                        }
                        alt="newsimage"
                        width={400}
                        height={400}
                      />
                    </div>
                    <div className="n-content">
                      <span></span>
                      <div className="n-text">{article.title}</div>
                    </div>
                    <Link
                      href={article.read_more || "#"}
                      className="news-read-more"
                    >
                      Read More
                      <LeftArrow />
                    </Link>
                  </div>
                </SwiperSlide>
              )
            )}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default NewsSection;
