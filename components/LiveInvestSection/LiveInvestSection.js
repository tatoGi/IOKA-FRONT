import React, { useState } from "react";
import Image from "next/image";
import styles from "./LiveInvestSection.module.css";

const LiveInvestSection = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const sliderData = [
    {
      id: 1,
      image: require("../../assets/img/homeBanner.jpg")
    },
    {
      id: 2,
      image: require("../../assets/img/homeBanner.jpg")
    },
    {
      id: 3,
      image: require("../../assets/img/homeBanner.jpg")
    }
  ];

  const next = () =>
    activeSlide < sliderData.length - 1 && setActiveSlide(activeSlide + 1);

  const prev = () => activeSlide > 0 && setActiveSlide(activeSlide - 1);

  const getStyles = (index) => {
    if (activeSlide === index)
      return {
        opacity: 1,
        transform:
          "translateX(0) translateY(100px) translateZ(0) rotateY(0deg)",
        zIndex: 10
      };
    else if (activeSlide - 1 === index)
      return {
        opacity: 1,
        transform:
          "translateX(-100px) translateY(0) translateZ(-200px) rotateY(35deg)",
        zIndex: 9
      };
    else if (activeSlide + 1 === index)
      return {
        opacity: 1,
        transform:
          "translateX(240px) translateY(0) translateZ(-200px) rotateY(-35deg)",
        zIndex: 9
      };
    else if (index < activeSlide - 1)
      return {
        opacity: 0,
        transform:
          "translateX(-480px) translateY(0) translateZ(-400px) rotateY(35deg)",
        zIndex: 8
      };
    else if (index > activeSlide + 1)
      return {
        opacity: 0,
        transform:
          "translateX(480px) translateY(0) translateZ(-400px) rotateY(-35deg)",
        zIndex: 8
      };
  };

  return (
    <section className={styles.liveInvestSection}>
      <div className="container-fluid">
        <div className="row">
          <div className={`${styles.content} col-md-6`}>
            <h4>Live. Invest. Grow</h4>
            <h2>
              DUBAI - YOUR PARTNER FOR
              <br />
              ACCELERATED GROWTH
            </h2>
            <button className={styles.contactBtn}>Contact Us</button>
          </div>

          <div className={`${styles.sliderContainer} col-md-6`}>
            <div className={styles.slider3D}>
              {sliderData.map((item, i) => (
                <div
                  key={item.id}
                  className={styles.slide}
                  style={getStyles(i)}
                >
                  <div className={styles.imageWrapper}>
                    <Image
                      src={item.image}
                      alt="Dubai Property"
                      width={400}
                      height={300}
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={prev}
            >
              ‹
            </button>
            <button
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={next}
            >
              ›
            </button>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <h3>86K</h3>
            <p>Resale Properties</p>
          </div>
          <div className={styles.statItem}>
            <h3>32K</h3>
            <p>Off Plan Properties</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveInvestSection;
