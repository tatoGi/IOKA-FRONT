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
import Meta from "../Meta/Meta";

const Hombanner = ({ initialData, navigationData }) => {
  console.log(initialData);
  
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
          const sectionMap = {};
          data.sections.forEach(section => {
            sectionMap[section.section_key] = section;
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
  

  // Don't render until component is mounted to prevent hydration mismatch
  if (!isMounted || isLoading) {
    return null; // Or replace with a spinner if you have one
  }

  // Render sections only if they exist
  return (
    <>
    <Meta data={initialData} />
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
        
        <PopularAreaSection sectionDataFour={sections["section_four"]} navigationData={navigationData} />
      )}
      {sections["section_five"] && (
        <TeamSection sectionDataFive={sections["section_five"]} />
      )}
      {sections["section_six"] && (
        <Clients sectionSixData={sections["section_six"]} />
      )}
      {sections["section_seven"] && ( 
        <NewsSection sectionSevenData={sections["section_seven"]} />
      )}
      <PartnersSection />
    </>
  );
};

export default Hombanner;
