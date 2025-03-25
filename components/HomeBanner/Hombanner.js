"use client";
import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import HomeBannerSwiper from "./HomeBannerSwiper";
import HomeBannerSearch from "../HomeBannerSearch/HomeBannerSearch";
import SubscribeSection from "../SubscribeSection/SubscribeSection";
import PartnersSection from "../PartnersSection/PartnersSection";
import NewsSection from "../NewsSection/NewsSection";
import TeamSection from "../TeamSection/TeamSection";
import PopularAreaSection from "../PopularAreaSection/PopularAreaSection";
import LiveInvestSection from "../LiveInvestSection/LiveInvestSection";
import NewProperties from "../NewProperties/NewProperties";
import Clients from "../Clients/Clients";

import { SECTION_API } from "../../routes/apiRoutes"; // Import the route
import { useRouter } from "next/router"; // Import useRouter

const Hombanner = ({ initialData }) => {
  const [cardData, setCardData] = useState(initialData || []);
  const [sectionOneData, setSectionOneData] = useState(null); // State for section_one data
  const [sectionTwoData, setSectionTwoData] = useState(null); // State for section_two data
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${SECTION_API}`);

        if (response.data && response.data.sections) {
          setCardData(response.data.sections); // Access the correct part of the response
          // Find the section with section_key equal to section_one
          const sectionOne = response.data.sections.find(section => section.section_key === "section_one");
          setSectionOneData(sectionOne); // Set section_one data
          // Find the section with section_key equal to section_two
          const sectionTwo = response.data.sections.find(section => section.section_key === "section_two");
          setSectionTwoData(sectionTwo); // Set section_two data
        } else {
          console.error("Invalid response structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [initialData]);

  return (
    <div className="home-banner">
      <div className="banner-slider">
        <HomeBannerSwiper sectionData={sectionOneData} /> {/* Pass section_one data */}
        <HomeBannerSearch />
        <LiveInvestSection sectionDataTwo={sectionTwoData} /> {/* Pass section_two data */}
        <NewProperties />
        <PopularAreaSection />
        <TeamSection />
        <Clients />
        <NewsSection />
        <PartnersSection />
        <SubscribeSection />
      </div>
    </div>
  );
};

export default Hombanner;
