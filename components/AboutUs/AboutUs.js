import React, { useState } from "react";
import AboutBanner from "@/components/AboutBanner/Banner";
import styles from "./AboutUs.module.css";
import Image from "next/image";
import TeamImage from "../../assets/img/team-1.png";
import Slider from "react-slick";
import TestimonialImage from "../../assets/img/team-1.png";
import SubscribeSection from "../SubscribeSection/SubscribeSection";
import PartnersSection from "../PartnersSection/PartnersSection";
// Custom arrow components
const PrevArrow = ({ onClick }) => (
  <button
    className={styles.prevArrow}
    onClick={onClick}
    type="button"
    aria-label="Previous slide"
  >
    ←
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    className={styles.nextArrow}
    onClick={onClick}
    type="button"
    aria-label="Next slide"
  >
    →
  </button>
);

const AboutUs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const openModal = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  // Define breadcrumb items
  const breadcrumbItems = [{ text: "Home", link: "/" }, { text: "About Us" }];

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ],
    centerMode: false,
    variableWidth: false
  };

  const testimonialSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className={`${styles.aboutSection}`}>
      <AboutBanner
        title="ABOUT US"
        description="As a brokerage rooted in one of the world's most iconic cities, we pride ourselves on"
      />

      {/* Statistics section */}
      <div>
        <div className={`container ${styles.statsContainer}`}>
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
        <div className={`container ${styles.agencySection}`}>
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
              We are currently hiring for the below mentioned roles. Please
              click on the role to view the full job description and apply with
              your CV and cover letter.
            </p>
            <span>Good Luck!</span>
          </div>

          <Slider {...sliderSettings} className={styles.vacanciesGrid}>
            <div className={`col-md-4 ${styles.vacancyCard}`}>
              <h4>Property Consultant German Speaker</h4>
              <span className={styles.date}>Nov 13, 2023</span>
              <p>
                We are looking to expand our talented sales team with Property
                Consultants who are Native or Bilingual in the German language.
                They will be responsible for providing clients with advice on
                investing in the property market, based on an analysis of the
                market and identification of the latest trends in...
              </p>
              <button
                className={styles.readMoreBtn}
                onClick={() =>
                  openModal({
                    title: "Property Consultant German Speaker",
                    date: "Nov 13, 2023",
                    responsibilities: [
                      "Provide property investment advice to clients after careful analysis of market conditions and trends and identify their needs and preferences",
                      "Provide customers with comprehensive and consistent support throughout the entire sales process",
                      "Attend events and property launches organized by developers",
                      "Finding clients in need of consultancy services through cold-calling, advertising, and business presentations",
                      "Perform comparative market analysis to provide advice on the off-plan property value",
                      "Discuss and follow up on opportunities with prospective buyers",
                      "Handle daily operations including internal company CRM tools",
                      "Follow proper documentation process for every transaction to ensure full compliance with the UAE real estate market laws and regulations",
                      "Promote sales through available advertisement channels, open houses, events, etc.",
                      "Collaborate with the marketing team and suggest new and innovative ideas for lead generation"
                    ]
                  })
                }
              ></button>
            </div>
            <div className={`col-md-4 ${styles.vacancyCard}`}>
              <h4>Property Consultant German Speaker</h4>

              <span className={styles.date}>Nov 13, 2023</span>
              <p>
                We are looking to expand our talented sales team with Property
                We are looking to expand our talented sales team with Property
                Consultants who are Native or Bilingual in the German language.
                They will be responsible for providing clients with advice on
                investing in the property market, based on an analysis of the
                market and identification of the latest trends in...
              </p>
              <button
                className={styles.readMoreBtn}
                onClick={() =>
                  openModal({
                    title: "Property Consultant German Speaker",
                    date: "Nov 13, 2023",
                    responsibilities: [
                      "Provide property investment advice to clients after careful analysis of market conditions and trends and identify their needs and preferences",
                      "Provide customers with comprehensive and consistent support throughout the entire sales process",
                      "Attend events and property launches organized by developers",
                      "Finding clients in need of consultancy services through cold-calling, advertising, and business presentations",
                      "Perform comparative market analysis to provide advice on the off-plan property value",
                      "Discuss and follow up on opportunities with prospective buyers",
                      "Handle daily operations including internal company CRM tools",
                      "Follow proper documentation process for every transaction to ensure full compliance with the UAE real estate market laws and regulations",
                      "Promote sales through available advertisement channels, open houses, events, etc.",
                      "Collaborate with the marketing team and suggest new and innovative ideas for lead generation"
                    ]
                  })
                }
              ></button>
            </div>
            <div className={`col-md-4 ${styles.vacancyCard}`}>
              <h4>Property Consultant German Speaker</h4>

              <span className={styles.date}>Nov 13, 2023</span>
              <p>
                We are looking to expand our talented sales team with Property
                Consultants who are Native or Bilingual in the German language.
                They will be responsible for providing clients with advice on
                investing in the property market, based on an analysis of the
                market and identification of the latest trends in...
              </p>
              <button
                className={styles.readMoreBtn}
                onClick={() =>
                  openModal({
                    title: "Property Consultant German Speaker",
                    date: "Nov 13, 2023",
                    responsibilities: [
                      "Provide property investment advice to clients after careful analysis of market conditions and trends and identify their needs and preferences",
                      "Provide customers with comprehensive and consistent support throughout the entire sales process",
                      "Attend events and property launches organized by developers",
                      "Finding clients in need of consultancy services through cold-calling, advertising, and business presentations",
                      "Perform comparative market analysis to provide advice on the off-plan property value",
                      "Discuss and follow up on opportunities with prospective buyers",
                      "Handle daily operations including internal company CRM tools",
                      "Follow proper documentation process for every transaction to ensure full compliance with the UAE real estate market laws and regulations",
                      "Promote sales through available advertisement channels, open houses, events, etc.",
                      "Collaborate with the marketing team and suggest new and innovative ideas for lead generation"
                    ]
                  })
                }
              ></button>
            </div>
          </Slider>
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

        {/* Contact Form Section */}
        <div className={styles.contactSection}>
          <div className={styles.contactContainer}>
            <h5 className={styles.contactSubtitle}>Send us Email</h5>
            <h2 className={styles.contactTitle}>Feel free to write</h2>

            <form className={styles.contactForm}>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  placeholder="Your Name"
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <input
                  type="email"
                  placeholder="Email Adress"
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <textarea
                  placeholder="Write a Message"
                  className={styles.formTextarea}
                  rows={6}
                ></textarea>
              </div>

              <button type="submit" className={styles.submitButton}>
                Send a Message
              </button>
            </form>
          </div>
        </div>
        <PartnersSection />
        <SubscribeSection />
      </div>

      {/* Job Application Modal */}
      {isModalOpen && selectedJob && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.closeButton} onClick={closeModal}>
              ×
            </button>

            <div className={styles.responsibilities}>
              <h2>{selectedJob.title}</h2>
              <div className={styles.date}>
                <h3>Key Responsibilities</h3>
                <ul>
                  {selectedJob.responsibilities.map((resp, index) => (
                    <li key={index}>{resp}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={styles.applicationForm}>
              <h3>Apply for this position</h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <input type="text" placeholder="First Name *" required />
                </div>
                <div className={styles.formGroup}>
                  <input type="text" placeholder="Last Name *" required />
                </div>
              </div>
              <div className={styles.formGroup}>
                <input type="email" placeholder="Email *" required />
              </div>
              <div className={styles.formGroup}>
                <input type="tel" placeholder="Mobile *" required />
              </div>
              <div className={styles.formGroup}>
                <input type="file" id="cv" required />
                <label htmlFor="cv" className={styles.fileUpload}>
                  Upload CV *
                </label>
              </div>
              <div className={styles.formGroup}>
                <textarea placeholder="Cover letter *" required></textarea>
              </div>
              <div className={styles.formCheckbox}>
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">I agree Terms & Privacy Policy</label>
              </div>
              <button type="submit" className={styles.submitButton}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutUs;
