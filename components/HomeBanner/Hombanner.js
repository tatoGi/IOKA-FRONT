"use-client";
import React from "react";
import HomeBannerSwiper from "./HomeBannerSwiper";
import SubscribeSection from "../SubscribeSection/SubscribeSection";
import PartnersSection from "../PartnersSection/PartnersSection";
import NewsSection from "../NewsSection/NewsSection";
import TeamSection from "../TeamSection/TeamSection";
import PopularAreaSection from "../PopularAreaSection/PopularAreaSection";

const Hombanner = () => {
  return (
    <div className="home-banner">
      <div className="banner-slider">
        <HomeBannerSwiper />
        <div className="banner-filter">
          <div className="filter-tabs">
            <button className="filter-tab active">OFFPLAN</button>
            <button className="filter-tab">RESALE</button>
            <button className="filter-tab">RENTAL</button>
          </div>
          <div className="filter-container">
            <div className="filter-inputs">
              <input type="text" placeholder="Where" className="filter-input" />
              <input type="text" placeholder="Size" className="filter-input" />
              <input type="text" placeholder="Price" className="filter-input" />
              <button className="search-btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <PopularAreaSection />
        <TeamSection />
        <NewsSection />
        <PartnersSection />
        <SubscribeSection />
      </div>
    </div>
  );
};

export default Hombanner;
