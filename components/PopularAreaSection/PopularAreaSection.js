import Image from "next/image";
import Link from "next/link";
import React from "react";
import Area from "../../assets/img/n-1.png";
import WhiteArrow from "../icons/WhiteArrow";

const PopularAreaSection = (sectionFourData) => {
  const sectionData = sectionFourData.sectionDataFour;
  const title = sectionData?.additional_fields?.title || "Default Title";
  const popularArea = sectionData?.additional_fields?.Add_Popular_Areas || [];

  return (
    <div className="popular-area-section">
      <div className="container">
        <div className="popular-area-title">
          {title}
        </div>
        <div className="popular-area-box">
          {popularArea.map((area, index) => (
            <Link href={"#"} className="area-item" key={index}>
              <Image src={Area} alt="popular area" />
              <div className="off-relase-box">
                <div className="topic">Off Plan</div>
                <div className="topic">Resale</div>
              </div>
              <div className="area-title">
                <div className="ar-title">{area.title}</div>
                <div className="arrow-box">
                  <WhiteArrow />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularAreaSection;
