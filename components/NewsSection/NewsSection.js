import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import Link from "next/link";
import LeftArrow from "../icons/LeftArrow";
import Image from "next/image";
import {BLOGS_API, PAGE_API} from "../../routes/apiRoutes";
import axios from "axios";
import baseimage from "../../assets/img/blogimage.png";

const NewsSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogsResponse, pagesResponse] = await Promise.all([
          axios.get(BLOGS_API),
          axios.get(PAGE_API)
        ]);
        // Handle possible variations in API response structure
        const blogsArray = blogsResponse?.data?.data || blogsResponse?.data?.blogs || blogsResponse?.data || [];

        // Keep only blogs that should appear on the main page (accept any truthy value)
        const filteredBlogs = blogsArray.filter(blog => Boolean(blog.show_on_main_page));

        // Helpful log in dev mode so we can see the raw response once (will be removed in prod)
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
        }
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
          {isMobileView ? (
            <Swiper className="mySwiper"
          
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
                    <div className="n-meta">
                      
                      <span className="n-date">
                        {new Date(article.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                      <div className="n-text">{article.title}</div>
                    </div>
                    <Link
                      href={`/blog/${article.slug}`}
                      className="news-read-more"
                    >
                      Read More
                      <LeftArrow />
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="desktop-news-grid">
              {blogs?.map((article, index) => (
                <div key={index} className="news-item">
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
                    <div className="n-meta">
                      <span className="n-date">
                        {new Date(article.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="n-text">{article.title}</div>
                  </div>
                  <Link
                    href={`/blog/${article.slug}`}
                    className="news-read-more"
                  >
                    Read More
                    <LeftArrow />
                  </Link>
                </div>
              ))}
            </div>
          )}
          <Link
            href={pages.find(p => p.type_id === 6)?.slug || "/Blog-Page"}
            className="news-see-more_mobile-only"
          >
            See More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsSection;
