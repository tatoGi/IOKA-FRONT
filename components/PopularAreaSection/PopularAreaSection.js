import Image from "next/image";
import Link from "next/link";
import React from "react";
import Area from "../../assets/img/area-1.png";
import WhiteArrow from "../icons/WhiteArrow";

const PopularAreaSection = () => {
  return (
    <div className="popular-area-section">
      <div className="container">
        <div className="popular-area-title">
          Explore Dubai’s Most Popular Areas
        </div>
        <div className="popular-area-box">
          <Link href={"#"} className="area-item">
            <Image src={Area} alt="popular area" />
            <div className="off-relase-box">
              <div className="topic">Off Plan</div>
              <div className="topic">Resale</div>
            </div>
            <div className="area-title">
              <div className="ar-title">
                International City Phase 2
              </div>
              <div className="arrow-box">
                <WhiteArrow />
              </div>
            </div>
          </Link>
          <Link href={"#"} className="area-item">
            <Image src={Area} alt="popular area" />
            <div className="off-relase-box">
              <div className="topic">Off Plan</div>
              <div className="topic">Resale</div>
            </div>
            <div className="area-title">
              <div className="ar-title">
                International City Phase 2
              </div>
              <div className="arrow-box">
                <WhiteArrow />
              </div>
            </div>
          </Link>
          <Link href={"#"} className="area-item">
            <Image src={Area} alt="popular area" />
            <div className="off-relase-box">
              <div className="topic">Off Plan</div>
              <div className="topic">Resale</div>
            </div>
            <div className="area-title">
              <div className="ar-title">
                International City Phase 2
              </div>
              <div className="arrow-box">
                <WhiteArrow />
              </div>
            </div>
          </Link>
          <Link href={"#"} className="area-item">
            <Image src={Area} alt="popular area" />
            <div className="off-relase-box">
              <div className="topic">Off Plan</div>
              <div className="topic">Resale</div>
            </div>
            <div className="area-title">
              <div className="ar-title">
                International City Phase 2
              </div>
              <div className="arrow-box">
                <WhiteArrow />
              </div>
            </div>
          </Link>
          <Link href={"#"} className="area-item">
            <Image src={Area} alt="popular area" />
            <div className="off-relase-box">
              <div className="topic">Off Plan</div>
              <div className="topic">Resale</div>
            </div>
            <div className="area-title">
              <div className="ar-title">
                International City Phase 2
              </div>
              <div className="arrow-box">
                <WhiteArrow />
              </div>
            </div>
          </Link>
          <Link href={"#"} className="area-item">
            <Image src={Area} alt="popular area" />
            <div className="off-relase-box">
              <div className="topic">Off Plan</div>
              <div className="topic">Resale</div>
            </div>
            <div className="area-title">
              <div className="ar-title">
                International City Phase 2
              </div>
              <div className="arrow-box">
                <WhiteArrow />
              </div>
            </div>
          </Link>
          <Link href={"#"} className="area-item">
            <Image src={Area} alt="popular area" />
            <div className="off-relase-box">
              <div className="topic">Off Plan</div>
              <div className="topic">Resale</div>
            </div>
            <div className="area-title">
              <div className="ar-title">
                International City Phase 2
              </div>
              <div className="arrow-box">
                <WhiteArrow />
              </div>
            </div>
          </Link>
          <Link href={"#"} className="area-item">
            <Image src={Area} alt="popular area" />
            <div className="off-relase-box">
              <div className="topic">Off Plan</div>
              <div className="topic">Resale</div>
            </div>
            <div className="area-title">
              <div className="ar-title">
                International City Phase 2
              </div>
              <div className="arrow-box">
                <WhiteArrow />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PopularAreaSection;
