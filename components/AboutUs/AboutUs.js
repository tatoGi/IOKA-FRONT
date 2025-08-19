import React, { useState, useEffect } from "react";
import AboutBanner from "@/components/AboutBanner/Banner";
import styles from "./AboutUs.module.css";
import Image from "next/image";
import ContactForm from "../contactForm/ContactForm";
import PartnersSection from "../PartnersSection/PartnersSection";
import { ABOUT_API, SECTION_API } from "../../routes/apiRoutes";
import { useRouter } from "next/router";
import axios from "axios";
import baseimage from "../../assets/img/blogimage.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from 'swiper';
import "swiper/css";
import "swiper/css/pagination";
import Slider from "react-slick";

const AboutUs = ({ initialData, id }) => {
  const [cardData, setCardData] = useState(initialData || null);
  const [sectionFiveData, setSectionFiveData] = useState(null);
  const router = useRouter();
  const [showScrollButton, setShowScrollButton] = useState(false);
  const TeamMembers = sectionFiveData?.additional_fields?.team_members || [];
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!id) {
        console.error("No ID provided to AboutUs component");
        return;
      }

      try {
        // Only fetch if we don't have initial data
        if (!initialData) {
          const [aboutResponse, teamResponse] = await Promise.all([
            axios.get(`${ABOUT_API}/${id}`),
            axios.get(`${SECTION_API}`)
          ]);

          if (!isMounted) return;

          const sectionFive = teamResponse.data.sections.find(
            (section) => section.section_key === "section_five"
          );
          
          setSectionFiveData(sectionFive);
          if (aboutResponse.data && aboutResponse.data.about) {
            setCardData(aboutResponse.data.about);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id, initialData]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const decodeImageUrl = (url) => {
    if (!url) return '';
    return decodeURIComponent(url);
  };

  // Always render the component - data will populate when available
  // if (!cardData) {
  //   return null;
  // }

  const renderStats = () => {
    // Slick settings for infinite, responsive, centered slides
    const settings = {
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 4,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
          },
        },
        {
          breakpoint: 0,
          settings: {
            slidesToShow: 1,
          },
        },
      ],
      arrows: false, // or true if you want arrows
      dots: false,   // or true if you want dots
    };

    if (isMobile) {
      return (
        <Slider {...settings} className={styles.statsSwiper}>
          {cardData?.additional_fields?.number_boxes?.map((box, index) => (
            <div key={index} className={styles.statSlide}>
              <div className={styles.statBox}>
                <div className={styles.statCircle}></div>
                <p>
                  {box.suffix}
                  {box.number}
                  <br />
                  {box.title}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      );
    }

    return (
      <div className={styles.statsContainer}>
        {cardData?.additional_fields?.number_boxes?.map((box, index) => (
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
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: ""
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const TestimonialSection = () => {
    // Check if testimonials array exists and has items
    if (!cardData?.additional_fields?.testimonials?.length) {
      return null;
    }
  
    const testimonials = cardData.additional_fields.testimonials;
  
    return (
      <>
        {testimonials.map((testimonial, index) => (
          <div key={index} className={styles.testimonialSection}>
            <div className={styles.testimonialContainer}>
              {testimonial.image && (
                <div className={styles.testimonialImageContainer}>
                  <div className={styles.testimonialImageWrapper}>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(testimonial.image)}`}
                      alt={testimonial.alt_text || 'Portrait'}
                      width={400}
                      height={400}
                      className={styles.testimonialImage}
                    />
                  </div>
                </div>
              )}
              <div className={styles.testimonialWrapper}>
                <div className={styles.testimonialContent}>
                  <div className={styles.testimonialHeader}>
                    <h3 className={styles.testimonialName}>
                      {testimonial.name || 'Unknown Name'}
                    </h3>
                    <p className={styles.testimonialRole}>
                      {testimonial.position || 'Unknown Position'}
                    </p>
                  </div>
                  <div className={styles.testimonialBody}>
                    {testimonial.description && (
                      <p className={styles.testimonialText}>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: testimonial.description,
                          }}
                        />
                      </p>
                    )}
                    {testimonial.quote && (
                      <p className={styles.welcomeText}>
                        <span
                          dangerouslySetInnerHTML={{ __html: testimonial.quote }}
                        />
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className={styles.aboutSection}>
      <div className={`container ${isMobile ? styles.mobileContainer : ''} container`}>
        {isMobile && <TestimonialSection />}

        <AboutBanner
          title={cardData?.title || "ABOUT US"}
          description={
            <span
              dangerouslySetInnerHTML={{ __html: cardData?.additional_fields?.testimonials?.[0]?.description }}
            ></span>
          }
        />

        {!isMobile && <TestimonialSection />}

        <div className={styles.statsSection}>
          {renderStats()}
        </div>

        <div className={styles.agencySection}>
          <h2>{cardData?.additional_fields?.your_agency}</h2>
          <div
            dangerouslySetInnerHTML={{
              __html: cardData?.additional_fields?.your_agency_description
            }}
          ></div>
        </div>

        <div className={styles.teamSection}>
          <div className={styles.teamGrid}>
            {TeamMembers.map((member, index) => (
              <div key={index} className={styles.teamMember}>
                <div className={styles.imageContainer}>
                  <Image
                    src={
                      member.image
                        ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(member.image)}`
                        : baseimage
                    }
                    alt={member.alt_text || "Team Member"}
                    width={200}
                    height={200}
                    className={styles.teamImage}
                  />
                </div>
                <h3>{member.title}</h3>
                    <p className={styles.experience}>{member.subtitle_1}</p>
                <p className={styles.experience}>{member.subtitle_2}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.formSection}>
          <div className={styles.formContainer}>
           
            <ContactForm pageTitle="About Page" />
          </div>
        </div>

        <PartnersSection />
      </div>
    </div>
  );
};

export default AboutUs;