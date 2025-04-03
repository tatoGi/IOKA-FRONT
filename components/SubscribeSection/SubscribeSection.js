import React from "react";
import ConstrImage from "../../assets/img/constructions-dubai.svg";
import Image from "next/image";

const SubscribeSection = () => {
  return (
    <div className="subscribe-section">
      <div className="subscribe-box">
        <div className="left-s-text">
          <div className="s-t-0">GET FIRST UPDATE</div>
          <div className="s-t-1">
            Get the news in front line by <span>subscribe</span> our latest
            updates
          </div>
        </div>
        <div className="middle-image-sub">
          <Image  
            src={ConstrImage}
            alt="Dubai skyline illustration"
            width={320}
            height={160}
            priority
          />
        </div>
        <div className="subscribe-form">
          <form>
            <input type="email" placeholder="Your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubscribeSection;
