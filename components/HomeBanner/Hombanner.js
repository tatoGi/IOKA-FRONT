"use-client";
import React from "react";
import HomeBannerSwiper from "./HomeBannerSwiper";
import HomeBannerSearch from "../HomeBannerSearch/HomeBannerSearch";
import SubscribeSection from "../SubscribeSection/SubscribeSection";
import PartnersSection from "../PartnersSection/PartnersSection";
import NewsSection from "../NewsSection/NewsSection";
import TeamSection from "../TeamSection/TeamSection";
import PopularAreaSection from "../PopularAreaSection/PopularAreaSection";
import styles from "./HomeBanner.module.css";
import LiveInvestSection from "../LiveInvestSection/LiveInvestSection";
import NewProperties from "../NewProperties/NewProperties";
import Clients from "../Clients/Clients";
const Hombanner = () => {
  return (
    <div className="home-banner">
      <div className="banner-slider">
        <HomeBannerSwiper />
        <HomeBannerSearch />
        <LiveInvestSection />
        <NewProperties />
        <PopularAreaSection />
        <Clients />
        <TeamSection />
        <NewsSection />
        <PartnersSection />
        <SubscribeSection />
      </div>
    </div>
  );
};

export default Hombanner;
