import React, { useState, useEffect } from "react";
import AboutBanner from "@/components/AboutBanner/Banner";
import styles from "./AboutUs.module.css";
import Image from "next/image";
import ContactForm from "../contactForm/ContactForm";
import PartnersSection from "../PartnersSection/PartnersSection";
import SubscribeSection from "../SubscribeSection/SubscribeSection";
import { ABOUT_API, SECTION_API } from "../../routes/apiRoutes"; // Import the routes
import { useRouter } from "next/router"; // Import useRouter
import axios from "axios"; // Add axios import
import baseimage from "../../assets/img/blogimage.png"; // Ensure this path is correct

const AboutUs = ({ initialData, id }) => {
  const [cardData, setCardData] = useState(initialData || {});
   const [sectionFiveData, setSectionFiveData] = useState(null); // State for section_five data
  const router = useRouter();
  const TeamMembers = sectionFiveData?.additional_fields?.team_members || [];
    
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        console.error("No ID provided to AboutUs component");
        return;
      }

      try {
        const response = await axios.get(`${ABOUT_API}/${id}`);
        const responseTeam = await axios.get(`${SECTION_API}`);
        const sectionFive = responseTeam.data.sections.find(section => section.section_key === "section_five");
        setSectionFiveData(sectionFive); // Set section_five data
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
     
      <AboutBanner
        title={cardData.title || "ABOUT US"}
        description={
          <span dangerouslySetInnerHTML={{ __html: testimonial?.description }}></span>
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
          <h2>{cardData.additional_fields?.your_agency}</h2>
          <div dangerouslySetInnerHTML={{ __html: cardData.additional_fields?.your_agency_description }}></div>
        </div>
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
                <p className={`${styles.testimonialText}`}>
                  <span dangerouslySetInnerHTML={{ __html: testimonial?.description }}></span>
                </p>
                <p className={styles.welcomeText}>
                  <span dangerouslySetInnerHTML={{ __html: testimonial?.quote }}></span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Team Section */}
        <div className={styles.teamGrid}>
          {TeamMembers.map((member, index) => (
            <div key={index} className={styles.teamMember}>
              <Image
                src={
                  member.image
                    ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(member.image)}`
                    : baseimage
                }
                alt="Team Member"
                width={200}
                height={200}
                className={styles.teamImage}
              />
              <h3>{member.title}</h3>
              <p>{member.subtitle_2}</p>
            </div>
          ))}
        </div>

        <div className={styles.formContainer}>
          <h5>Send us Email</h5>
          <ContactForm />
        </div>
        <PartnersSection />
        <SubscribeSection />
      </div>
    </div>
  );
};

export default AboutUs;
