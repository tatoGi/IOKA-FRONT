import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import HomeBannerSwiper from "./HomeBannerSwiper";
import HomeBannerSearch from "../HomeBannerSearch/HomeBannerSearch";
import PartnersSection from "../PartnersSection/PartnersSection";
import NewsSection from "../NewsSection/NewsSection";
import TeamSection from "../TeamSection/TeamSection";
import PopularAreaSection from "../PopularAreaSection/PopularAreaSection";
import LiveInvestSection from "../LiveInvestSection/LiveInvestSection";
import NewProperties from "../NewProperties/NewProperties";
import Clients from "../Clients/Clients";
import { SECTION_API } from "../../routes/apiRoutes"; // Import the route
import { useRouter } from "next/router"; // Import useRouter
import { useMediaQuery } from "react-responsive"; // Import useMediaQuery

const Hombanner = ({ initialData, navigationData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [cardData, setCardData] = useState(initialData || []);
  const [sections, setSections] = useState({}); // Store all sections in one object
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter(); // Initialize useRouter
  const isMobile = useMediaQuery({ maxWidth: 768 }); // Check if the view is mobile

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(SECTION_API);
        if (data?.sections) {
          setCardData(data.sections);
          // Build a map, but keep the first (or most complete) entry for every section_key
          const sectionMap = {};
          data.sections.forEach(section => {
            const key = section.section_key;
            if (!sectionMap[key]) {
              sectionMap[key] = section; // first occurrence
            } else {
              // If the stored version has no slider images but the new one does, replace it
              const prevImgs = sectionMap[key]?.additional_fields?.slider_images?.length || 0;
              const currImgs = section?.additional_fields?.slider_images?.length || 0;
              if (currImgs > prevImgs) {
                sectionMap[key] = section;
              }
            }
          });
          setSections(sectionMap);
        } else {
          console.error("Invalid response structure:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [initialData]);
  

  // Wait for mount. While loading, render a placeholder to preserve layout order
  if (!isMounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="home-banner" style={{ minHeight: '400px' }}>
        {/* You can replace this with a spinner or skeleton */}
      </div>
    );
  }

  // Render sections only if they exist
  return (
    <>
      <div className="home-banner">
        <div className="banner-slider">
          {sections["section_one"] && (
            <HomeBannerSwiper sectionData={sections["section_one"]} />
          )}
          <HomeBannerSearch />
        </div>
      </div>
      {sections["section_two"] && (
        <LiveInvestSection sectionDataTwo={sections["section_two"]} navigationData={navigationData} />
      )}
      {sections["section_three"] && (
        <NewProperties sectionDataThree={sections["section_three"]} />
      )}
      {sections["section_four"] && (
        <PopularAreaSection sectionDataFour={sections["section_four"]} />
      )}
      {sections["section_five"] && (
        <TeamSection sectionDataFive={sections["section_five"]} />
      )}
      {sections["section_six"] && (
        <Clients sectionSixData={sections["section_six"]} />
      )}
      
        <NewsSection sectionSevenData={sections["section_seven"]} />
      
      <PartnersSection />
    </>
  );
};

export default Hombanner;
