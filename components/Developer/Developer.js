import React from "react";
import styles from "./Developer.module.css";
import Image from "next/image";
import Slider from "react-slick";
import DeveloperImage from "../../assets/img/developerimg.png";



const Developer = () => {
  // Define breadcrumb items
  const breadcrumbItems = [{ text: "Home", link: "/" }, { text: "Developer" }];

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
    <div className={styles.developerSection}>
      {/* Statistics section */}
      <div className="container">
        <div className={styles.statsContainer}>
          <div className={styles.statBox}>
            <div className={styles.statCircle}></div>
            <p>Global Reach</p>
          </div>

          <div className={styles.statBox}>
            <div className={styles.statCircle}></div>
            <p>
              1000+
              <br />
              PROJECTS COMPLETED
            </p>
          </div>

          <div className={styles.statBox}>
            <div className={styles.statCircle}></div>
            <p>
              200+
              <br />
              DEVELOPERS
            </p>
          </div>

          <div className={styles.statBox}>
            <div className={styles.statCircle}></div>
            <p>
              500+
              <br />
              HAPPY CLIENTS
            </p>
          </div>
        </div>

        {/* Our Developers Section */}
        <div className={styles.developersSection}>
          <h2>Our Developers</h2>
          <p>
            Meet the team of skilled developers who turn ideas into reality.
          </p>
        </div>

        {/* Team Section */}
        <div className="container">
          <div className="row">
            <div className="col-6 col-md-4">
              <div className={styles.teamMember}>
                <Image
                  src={DeveloperImage}
                  alt="Jane Doe"
                  width={200}
                  height={200}
                  className={styles.teamImage}
                />
                <h3>Jane Doe</h3>
                <p>7+ Years Experience</p>
              </div>
            </div>

            <div className="col-6 col-md-4">
              <div className={styles.teamMember}>
                <Image
                  src={DeveloperImage}
                  alt="John Smith"
                  width={200}
                  height={200}
                  className={styles.teamImage}
                />
                <h3>John Smith</h3>
                <p>5+ Years Experience</p>
              </div>
            </div>

            <div className="col-6 col-md-4">
              <div className={styles.teamMember}>
                <Image
                  src={DeveloperImage}
                  alt="Alice Johnson"
                  width={200}
                  height={200}
                  className={styles.teamImage}
                />
                <h3>Alice Johnson</h3>
                <p>6+ Years Experience</p>
              </div>
            </div>
          </div>
        </div>

        {/* Careers Section */}
        <div className={styles.careersSection}>
          <div className={styles.careersSectiontext}>
            <h2 className={styles.careerstitle}>CAREERS</h2>
            <h3>Join Our Development Team</h3>
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

export default Developer;
