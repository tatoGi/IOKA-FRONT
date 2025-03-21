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
import NImage from '../../assets/img/n-1.png';

const NewsSection = () => {
  return (
    <div className="news-section">
      <div className="container">
        <div className="news-header">
          <div className="news-title">Recent Articles & News</div>
          <Link href="#" className="news-see-more">
            SEE MORE
          </Link>
        </div>
        <div className="news-text">
          passion for real estate. This distinctive approach set us apart from
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
                spaceBetween: 10, 
              },
              575: {
                slidesPerView: 1,
                spaceBetween: 24, 
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1560: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
          >
            <SwiperSlide>
              <div className="news-item">
                <div className="n-image">
                  <Image src={NImage} alt="newsimage" />
                </div>
                <div className="n-content">
                  <span>Tips & Tricks • Sep 2, 2024</span>
                  <div className="n-text">
                    Chip and Joanna Gaines’ Latest Fixer-Upper Is Open for Visitors
                  </div>
                </div>
                <Link href={"#"} className="news-read-more">
                  Read More
                  <LeftArrow />
                </Link>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="news-item">
                <div className="n-image">
                  <Image src={NImage} alt="newsimage" />
                </div>
                <div className="n-content">
                  <span>Tips & Tricks • Sep 2, 2024</span>
                  <div className="n-text">
                    Chip and Joanna Gaines’ Latest Fixer-Upper Is Open for Visitors
                  </div>
                </div>
                <Link href={"#"} className="news-read-more">
                  Read More
                  <LeftArrow />
                </Link>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="news-item">
                <div className="n-image">
                  <Image src={NImage} alt="newsimage" />
                </div>
                <div className="n-content">
                  <span>Tips & Tricks • Sep 2, 2024</span>
                  <div className="n-text">
                    Chip and Joanna Gaines’ Latest Fixer-Upper Is Open for Visitors
                  </div>
                </div>
                <Link href={"#"} className="news-read-more">
                  Read More
                  <LeftArrow />
                </Link>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="news-item">
                <div className="n-image">
                  <Image src={NImage} alt="newsimage" />
                </div>
                <div className="n-content">
                  <span>Tips & Tricks • Sep 2, 2024</span>
                  <div className="n-text">
                    Chip and Joanna Gaines’ Latest Fixer-Upper Is Open for Visitors
                  </div>
                </div>
                <Link href={"#"} className="news-read-more">
                  Read More
                  <LeftArrow />
                </Link>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default NewsSection;