import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import Link from 'next/link';
import styles from './HomeBanner.module.css';

const HomeBannerSwiper = ({ sectionData }) => {
  const decodeImageUrl = (url) => {
    return decodeURIComponent(url);
  };

  return (
    <Swiper
      pagination={{
        clickable: true,
        bulletActiveClass: `${styles['swiper-pagination-bullet-active']}`,
      }}
      modules={[Pagination, Autoplay]}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      className={`mySwiper ${styles['swiper-container']}`}
      style={{ height: '100%' }}
    >
      {sectionData &&
        sectionData.additional_fields.slider_images.map((image, index) => (
          
          <SwiperSlide key={index} className={styles['swiper-item-relative']}>
            <Link href={'#'} className={styles['in-sw-item']}>
              <div className={styles['image-overlay']}></div>
              <div className={styles['banner-content']}>
                <div className={styles['text-b-i']}>
                  {sectionData.additional_fields.subtitle}
                </div>
                <h1>{sectionData.additional_fields.title}</h1>
              </div>
              <div className={styles['swiper-item-img']}>
                <Image
                  src={
                    image.image
                      ? `${
                          process.env.NEXT_PUBLIC_API_URL
                        }/storage/${decodeImageUrl(image.image)}`
                      : baseimage
                  }
                  alt={image.alt_text || "homeBanner"}
                  priority
                  quality={100}
                  width={1920}
                  height={1080}
                />
              </div>
            </Link>
          </SwiperSlide>
        ))}
    </Swiper>
  );
};

export default HomeBannerSwiper;