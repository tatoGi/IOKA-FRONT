import React, { useState, useEffect } from "react";
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
import {BLOGS_API, PAGE_API} from "../../routes/apiRoutes";
import axios from "axios";

const NewsSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogsResponse, pagesResponse] = await Promise.all([
          axios.get(BLOGS_API),
          axios.get(PAGE_API)
        ]);
       
        const filteredBlogs = blogsResponse.data.data.filter(blog => blog.show_on_main_page === true);
       
        const blogPages = pagesResponse.data.pages.filter(page => page.type_id === 6);
        
        setBlogs(filteredBlogs);
        setPages(blogPages);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const decodeImageUrl = (url) => {
    return decodeURIComponent(url);
  };

  const getBlogUrl = (slug) => {
    const blogPage = pages.find(p => p.type_id === 6);
    return blogPage ? `/${blogPage.slug}/${slug}` : `/blog/${slug}`;
  };


  return (
    <div className="news-section">
      <div className="container">
        <div className="news-header">
          <div className="news-title">Recent Articles & News</div>
          <Link
            href={pages.find(p => p.type_id === 6)?.slug || "/Blog-Page"}
            className="news-see-more"
          >
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
            grabCursor={true}
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
              768: {
                slidesPerView: 1,
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
            {blogs?.map((article, index) => (
              <SwiperSlide key={index}>
                <div className="news-item">
                  <div className="n-image">
                    <Image
                      src={
                        article.image
                          ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(article.image)}`
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
                    href={getBlogUrl(article.slug)}
                    className="news-read-more"
                  >
                    Read More
                    <LeftArrow />
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <Link
            href={pages.find(p => p.type_id === 6)?.slug || "/Blog-Page"}
            className="news-see-more_mobile-only"
          >
            SEE MORE
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsSection;
