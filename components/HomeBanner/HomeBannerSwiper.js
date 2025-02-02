import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image'; 
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import '@/styles/globals.css';
 
import { Pagination } from 'swiper/modules';
import Link from 'next/link';
// import homeImg from '../../assets/img/homeBanner.jpg'

const HomeBannerSwiper = () => {
  return (
    <Swiper pagination={true} modules={[Pagination]} className="mySwiper swiper-handle-change">
        <SwiperSlide className='swiper-item-relative'>
            <Link href={'#'} className="in-sw-item">
                <div className="banner-content">
                    <div className="text-b-i">
                        IOKA Development
                    </div>
                    <h1>
                        Inspired by Bugatti Hypercars, this 
                        Architectural Masterpiece 1111
                    </h1>
                </div>    
                <div className="swiper-item-img"> 
                    <Image src={require("../../assets/img/homeBanner.jpg")} alt="homeBanner" /> 
                </div>
            </Link>
        </SwiperSlide> 
        <SwiperSlide className='swiper-item-relative'>
            <Link href={'#'} className="in-sw-item">
                <div className="banner-content">
                    <div className="text-b-i">
                        IOKA Development
                    </div>
                    <h1>
                        Inspired by Bugatti Hypercars, this 
                        Architectural Masterpiece 2222
                    </h1>
                </div>    
                <div className="swiper-item-img"> 
                    <Image src={require("../../assets/img/homeBanner.jpg")} alt="homeBanner" /> 
                </div>
            </Link>
        </SwiperSlide> 
    </Swiper>
  )
}

export default HomeBannerSwiper