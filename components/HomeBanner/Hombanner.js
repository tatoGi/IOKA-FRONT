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
import { LoadingWrapper } from "../LoadingWrapper/index";
import { SECTION_API } from "../../routes/apiRoutes"; // Import the route
import { useRouter } from "next/router"; // Import useRouter
import { useMediaQuery } from "react-responsive"; // Import useMediaQuery

const Hombanner = ({ initialData }) => {
  const [cardData, setCardData] = useState(initialData || []);
  const [sectionOneData, setSectionOneData] = useState(null); // State for section_one data
  const [sectionTwoData, setSectionTwoData] = useState(null); // State for section_two data
  const [sectionThreeData, setSectionThreeData] = useState(null); // State for section_three data
  const [sectionFourData, setSectionFourData] = useState(null); // State for section_four data
  const [sectionFiveData, setSectionFiveData] = useState(null); // State for section_five data
  const [sectionSixData, setSectionSixData] = useState(null); // State for section_six data
  const [sectionSevenData, setSectionSevenData] = useState(null); // State for section_seven data
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const router = useRouter(); // Initialize useRouter
  const isMobile = useMediaQuery({ maxWidth: 768 }); // Check if the view is mobile

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
          // Find the section with section_key equal to section_three
          const sectionThree = response.data.sections.find(section => section.section_key === "section_three");
          setSectionThreeData(sectionThree); // Set section_three data
          // Find the section with section_key equal to section_four
          const sectionFour = response.data.sections.find(section => section.section_key === "section_four");
          setSectionFourData(sectionFour); // Set section_four data
          // Find the section with section_key equal to section_five
          const sectionFive = response.data.sections.find(section => section.section_key === "section_five");
          setSectionFiveData(sectionFive); // Set section_five data
        
          // Find the section with section_key equal to section_six
          const sectionSix = response.data.sections.find(section => section.section_key === "section_six");
          setSectionSixData(sectionSix); // Set section_six data
          
          const sectionSeven = response.data.sections.find(section => section.section_key === "section_seven");
          setSectionSevenData(sectionSeven); // Set section
        } else {
          console.error("Invalid response structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchData();
  }, [initialData]);

  if (isLoading) {
    return <LoadingWrapper />; // Show loading wrapper while data is loading
  }
  
  return (
    <div>
    <div className="home-banner">
      <div className="banner-slider">
        <HomeBannerSwiper sectionData={sectionOneData} /> {/* Pass section_one data */}
        <HomeBannerSearch />
      </div>
    </div>
     <LiveInvestSection sectionDataTwo={sectionTwoData} /> {/* Pass section_two data */}
     {/* Add components for sections three, four, five, and six */}
     <NewProperties sectionDataThree={sectionThreeData} /> {/* Pass section_three data */}
     <PopularAreaSection sectionDataFour={sectionFourData} /> {/* Pass section_four data */}
     <TeamSection sectionDataFive={sectionFiveData} /> {/* Pass section_five data */}
     <Clients sectionSixData={sectionSixData} /> {/* Pass section_six data */}
     <NewsSection sectionSevenData={sectionSevenData} /> {/* Pass section_seven data */}
     <PartnersSection />
    
       <div className="container">
         <SubscribeSection />
       </div>
    
    </div>
  );
};

export default Hombanner;
