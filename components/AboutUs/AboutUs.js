import React, { useState, useEffect } from "react";
import AboutBanner from "@/components/AboutBanner/Banner";
import styles from "./AboutUs.module.css";
import Image from "next/image";
import TeamImage from "../../assets/img/team-1.png";
import TestimonialImage from "../../assets/img/team-1.png";
import ContactForm from "../contactForm/ContactForm";
import PartnersSection from "../PartnersSection/PartnersSection";
import SubscribeSection from "../SubscribeSection/SubscribeSection";
import { ABOUT_API } from "../../routes/apiRoutes"; // Import the route
import { useRouter } from "next/router"; // Import useRouter
import axios from "axios"; // Add axios import
import baseimage from "../../assets/img/blogimage.png"; // Ensure this path is correct
const AboutUs = ({ initialData, id }) => {
  const [cardData, setCardData] = useState(initialData || {});
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        console.error("No ID provided to AboutUs component");
        return;
      }

      try {
        const response = await axios.get(`${ABOUT_API}/${id}`);

        if (response.data && response.data.about) {
          setCardData(response.data.about);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (!initialData && id) {
      fetchData();
    }
  }, [initialData, id]);
  const decodeImageUrl = (url) => {
    return decodeURIComponent(url);
  };

  // Update the testimonial section to use the fetched data
  const testimonial = cardData.additional_fields?.testimonials?.[0] || {};

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
                src={
                  testimonial.image
                    ? `${
                        process.env.NEXT_PUBLIC_API_URL
                      }/storage/${decodeImageUrl(testimonial.image)}`
                    : baseimage
                }
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
                <h3 className={styles.testimonialName}>
                  {testimonial.name || "Max Musterman"}
                </h3>
                <p className={styles.testimonialRole}>
                  {testimonial.position || "CEO Chairman"}
                </p>
              </div>
              <div className={styles.testimonialBody}>
                <p className={styles.testimonialText}>
                  {testimonial.description ||
                    "As a brokerage rooted in one of the world's most iconic cities..."}
                </p>
                <p className={styles.welcomeText}>
                  {testimonial.quote ||
                    "Welcome to IOKA, your trusted guide in Dubai's dynamic real estate market."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AboutBanner
        title={cardData.title || "ABOUT US"}
        description={
          (cardData.additional_fields?.paragraph?.title || "").replace(
            /<\/?p>/g,
            ""
          ) ||
          "As a brokerage rooted in one of the world's most iconic cities, we pride ourselves on"
        }
      />

      {/* Statistics section */}
      <div className={styles.container}>
        <div className={styles.statsContainer}>
          {cardData.additional_fields?.number_boxes?.map((box, index) => (
            <div key={index} className={styles.statBox}>
              <div className={styles.statCircle}></div>
              <p>
                {box.suffix}
                {box.number}
                <br />
                {box.title}
              </p>
            </div>
          ))}
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
          <ContactForm />
        </div>
        <PartnersSection />
        <SubscribeSection />
      </div>
    </div>
  );
};

export default AboutUs;
