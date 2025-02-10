import React from "react";
import AboutBanner from "@/components/AboutBanner/Banner";
import BreadcrumbSection from "@/components/BreadcrumbSection/BreadcrumbSection";
import styles from "./AboutUs.module.css";
import Image from "next/image";
import TeamImage from "../../assets/img/team-1.png";
import TestimonialImage from "../../assets/img/team-1.png";
import ContactForm from "../contactForm/ContactForm";
import PartnersSection from "../PartnersSection/PartnersSection";
import SubscribeSection from "../SubscribeSection/SubscribeSection";

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
          slidesToShow: 2
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1
        }
      }
    ]
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
        {/* Testimonials Section */}
        <div className={styles.testimonialSection}>
          <div className={styles.testimonialContainer}>
            <div className={styles.testimonialImageContainer}>
              <div className={styles.testimonialImageWrapper}>
                <Image
                  src={TestimonialImage}
                  alt="CEO Portrait"
                  width={400}
                  height={400}
                  className={styles.testimonialImage}
                />
                <div className={styles.curvedConnector}></div>
              </div>
            </div>
            <div className={styles.testimonialWrapper}>
              <div className={styles.testimonialContent}>
                <div className={styles.testimonialHeader}>
                  <h3 className={styles.testimonialName}>Max Musterman</h3>
                  <p className={styles.testimonialRole}>CEO Chairman</p>
                </div>
                <div className={styles.testimonialBody}>
                  <p className={styles.testimonialText}>
                    As a brokerage rooted in one of the world's most iconic
                    cities, we pride ourselves on clarity, efficiency, and an
                    unwavering commitment to client satisfaction.
                  </p>
                  <p className={styles.testimonialText}>
                    Our mission is to elevate your real estate experience with
                    unparalleled expertise and dedication. We navigate the
                    complexities of the market with precision, providing clear
                    assistance and tailored strategies to achieve your goals
                    seamlessly and efficiently.
                  </p>
                  <p className={styles.testimonialText}>
                    At IOKA, we strive to be more than your real estate
                    brokers—we are your reliable partners. We are dedicated to
                    earning your trust and building long-term relationships.
                    Understanding your unique goals is at the heart of our
                    approach, allowing us to combine personalized service with
                    strategic insights to deliver exceptional results with the
                    highest standards of professionalism.
                  </p>
                  <p className={styles.welcomeText}>
                    Welcome to IOKA, your trusted guide in Dubai's dynamic real
                    estate market.
                  </p>
                </div>
              </div>
            </div>
          </div>
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
          <div className={styles.careersSectionContent}>
            <h2>CAREERS</h2>
            <h3>Join An Award-winning Team</h3>
            <div className={styles.currentVacancies}>
              <h4>Current Vacancies</h4>
              <p>
                We are currently hiring for the below mentioned roles. Please
                click on the role to view the full job description and apply
                with your CV and cover letter.
              </p>
              <span>Good Luck!</span>
            </div>
          </div>
        </div>
        <ContactForm />
        <PartnersSection />
        <SubscribeSection />
      </div>
    </div>
  );
};

export default AboutUs;
