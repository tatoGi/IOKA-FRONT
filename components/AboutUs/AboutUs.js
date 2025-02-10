import React from "react";
import AboutBanner from "@/components/AboutBanner/Banner";
import styles from "./AboutUs.module.css";
import Image from "next/image";
import TeamImage from "../../assets/img/team-1.png";
import Slider from "react-slick";

const AboutUs = () => {
  // Define breadcrumb items
  const breadcrumbItems = [{ text: "Home", link: "/" }, { text: "About Us" }];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className={styles.aboutSection}>
      <AboutBanner
        title="ABOUT US"
        description="As a brokerage rooted in one of the world's most iconic cities, we pride ourselves on"
      />

      {/* Statistics section */}
      <div className={styles.container}>
        <div className={styles.statsContainer}>
          <div className={styles.statBox}>
            <div className={styles.statCircle}></div>
            <p>World Wide</p>
          </div>

          <div className={styles.statBox}>
            <div className={styles.statCircle}></div>
            <p>
              500+
              <br />
              ESTATE EXPERTS
            </p>
          </div>

          <div className={styles.statBox}>
            <div className={styles.statCircle}></div>
            <p>
              $350+
              <br />
              MILLIONS
              <br />
              IN DEAL
            </p>
          </div>

          <div className={styles.statBox}>
            <div className={styles.statCircle}></div>
            <p>
              3500+
              <br />
              SOLD PROPERTY
            </p>
          </div>
        </div>

        {/* Your Agency Section */}
        <div className={styles.agencySection}>
          <h2>Your Agency</h2>
          <p>
            Welcome to IOKA, your trusted guide in Dubai's dynamic real estate
            market.
          </p>
        </div>

        {/* Team Section */}
        <div className={styles.teamGrid}>
          <div className={styles.teamMember}>
            <Image
              src={TeamImage}
              alt="John Doe"
              width={200}
              height={200}
              className={styles.teamImage}
            />
            <h3>John Doe</h3>
            <p>5+ Years Experience</p>
          </div>

          <div className={styles.teamMember}>
            <Image
              src={TeamImage}
              alt="Max Musterman"
              width={200}
              height={200}
              className={styles.teamImage}
            />
            <h3>Max Musterman</h3>
            <p>5+ Years Experience</p>
          </div>

          <div className={styles.teamMember}>
            <Image
              src={TeamImage}
              alt="John Lenon"
              width={200}
              height={200}
              className={styles.teamImage}
            />
            <h3>John Lenon</h3>
            <p>5+ Years Experience</p>
          </div>
        </div>

        {/* Careers Section */}
        <div className={styles.careersSection}>
          <div className={styles.careersSectiontext}>
            <h2 className={styles.careerstitle}>CAREERS</h2>
            <h3>Join An Award-winning Team</h3>
            <h4>Current Vacancies</h4>
            <p>
              We are currently hiring for the below-mentioned roles. Please click
              on the link to view the full job description and to apply online.
            </p>
            <span>
              Good Luck!
            </span>
          </div>
         
          <Slider {...sliderSettings} className={styles.vacanciesGrid}>
            <div className={styles.vacancyCard}>
              <h4>Role 1</h4>
              <p>Job description for role 1.</p>
            </div>
            <div className={styles.vacancyCard}>
              <h4>Role 2</h4>
              <p>Job description for role 2.</p>
            </div>
            <div className={styles.vacancyCard}>
              <h4>Role 3</h4>
              <p>Job description for role 3.</p>
            </div>
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
