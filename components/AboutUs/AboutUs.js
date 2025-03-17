import React, { useState } from "react";
import AboutBanner from "@/components/AboutBanner/Banner";
import styles from "./AboutUs.module.css";
import Image from "next/image";
import TeamImage from "../../assets/img/team-1.png";
import TestimonialImage from "../../assets/img/team-1.png";
import ContactForm from "../contactForm/ContactForm";
import PartnersSection from "../PartnersSection/PartnersSection";
import SubscribeSection from "../SubscribeSection/SubscribeSection";

const AboutUs = () => {
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you can add your form submission logic
    console.log("Form submitted:", formData);
    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: ""
    });
  };
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
      message: ""
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    };
  
  return (
    <div className="container">
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
                 
                  <p className={styles.welcomeText}>
                    Welcome to IOKA, your trusted guide in Dubai's dynamic real
                    estate market.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
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

      
        <div className={styles.formContainer}>
      <h2 className={styles.title}>Feel free to write</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          className={styles.input}
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address"
          className={styles.input}
          required
        />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className={styles.input}
          required
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Write a Message"
          className={styles.textarea}
          required
        />
        <button type="submit" className={styles.submitButton}>
          Send a Message
        </button>
      </form>
    </div>
        <PartnersSection />
        <SubscribeSection />
      </div>
    </div>
  );
};

export default AboutUs;
