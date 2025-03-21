import React, { useState } from "react";
import Image from "next/image";
import styles from "./LiveInvestSection.module.css";
import homeBanner from "../../assets/img/homeBanner.jpg";
const LiveInvestSection = () => {
  const [activeSlide, setActiveSlide] = useState(1);
  const sliderData = [
    { id: 1, image: homeBanner },
    { id: 2, image: homeBanner },
    { id: 3, image: homeBanner },
  ];

  const next = () => {
    setActiveSlide((prev) => (prev === sliderData.length - 1 ? 0 : prev + 1));
  };

  const prev = () => {
    setActiveSlide((prev) => (prev === 0 ? sliderData.length - 1 : prev - 1));
  };

  return (
    <section className={styles.liveInvestSection}>
      <div className={styles.topWhiteDiv}></div>
      <div className="container">
        <div className="row">
          <div className={`${styles.content} col-md-6`}>
            <h4>Live. Invest. Grow</h4>
            <h2>
              DUBAI - YOUR PARTNER FOR
              <br />
              ACCELERATED GROWTH
            </h2>
            <p>
              Want to search for potential matches? From studio apartments to
              penthouses- select your layout to see what’s available. When you
              spot something that catches your eye, we’re here to help
            </p>
            <button className={styles.contactBtn}>Contact Us</button>
          </div>
          <div className={`${styles.sliderContainer} col-md-6`}>
            <div className={styles.sliderWrapper}>
              {sliderData.map((item, i) => {
                let positionClass =
                  i === activeSlide
                    ? styles.center
                    : i === (activeSlide + 1) % sliderData.length
                    ? styles.right
                    : styles.left;

                return (
                  <div key={item.id} className={`${styles.slide} ${positionClass}`}>
                    <Image
                      src={item.image}
                      alt="Dubai Property"
                      width={364}
                      height={364}
                      style={{ objectFit: "cover", borderRadius: "16px" }}
                    />
                  </div>
                );
              })}
            </div>
            <button className={`${styles.navButton} ${styles.prevButton}`} onClick={prev}>
              ‹
            </button>
            <button className={`${styles.navButton} ${styles.nextButton}`} onClick={next}>
              ›
            </button>
          </div>
        </div>
      </div>
      <div className={styles.topWhiteDiv}></div>
<div className={styles.bottomWhiteDiv}></div>
      <div className={styles.statItems}>
      <div className={styles.statItem} style={{ marginRight: '106px' }}>

          <h3>86K</h3>
          <p>Resale Properties</p>
        </div>
        <div className={styles.statItem}>
          <h3>32K</h3>
          <p>Off Plan Properties</p>
        </div>
      </div>
    </section>
  );
};

export default LiveInvestSection;