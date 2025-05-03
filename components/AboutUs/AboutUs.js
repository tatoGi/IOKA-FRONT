import React, { useState, useEffect } from "react";
import AboutBanner from "@/components/AboutBanner/Banner";
import styles from "./AboutUs.module.css";
import Image from "next/image";
import ContactForm from "../contactForm/ContactForm";
import PartnersSection from "../PartnersSection/PartnersSection";
import SubscribeSection from "../SubscribeSection/SubscribeSection";
import { ABOUT_API, SECTION_API } from "../../routes/apiRoutes";
import { useRouter } from "next/router";
import axios from "axios";
import baseimage from "../../assets/img/blogimage.png";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { LoadingWrapper } from "../LoadingWrapper/index";

const AboutUs = ({ initialData, id }) => {
  const [cardData, setCardData] = useState(null);
  const [sectionFiveData, setSectionFiveData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const TeamMembers = sectionFiveData?.additional_fields?.team_members || [];
  const [isMobile, setIsMobile] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
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
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
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
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (initialData) {
      setCardData(initialData);
      if (!sectionFiveData) {
        axios.get(`${SECTION_API}`)
          .then(response => {
            if (!isMounted) return;
            const sectionFive = response.data.sections.find(
              (section) => section.section_key === "section_five"
            );
            setSectionFiveData(sectionFive);
          })
          .catch(error => {
            console.error("Error fetching team data:", error);
          })
          .finally(() => {
            if (isMounted) {
              setIsLoading(false);
            }
          });
      } else {
        setIsLoading(false);
      }
    } else {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [id, initialData]);

  // Handle route changes
  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsLoading(true);
    };

    const handleRouteChangeComplete = () => {
      setIsLoading(false);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

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
    return decodeURIComponent(url);
  };

  const renderStats = () => {
    if (isMobile) {
      return (
        <Swiper
          spaceBetween={12}
          slidesPerView={4}
          className={styles.statsSwiper}
        >
          {cardData?.additional_fields?.number_boxes?.map((box, index) => (
            <SwiperSlide key={index} className={styles.statSlide}>
              <div className={styles.statBox}>
                <div className={styles.statCircle}></div>
                <p>
                  {box.suffix}
                  {box.number}
                  <br />
                  {box.title}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
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
    if (!cardData?.additional_fields?.testimonials?.[0]) {
      return null;
    }

    const testimonial = cardData.additional_fields.testimonials[0];
    return (
      <div className={styles.testimonialSection}>
        <div className={styles.testimonialContainer}>
          <div className={styles.testimonialImageContainer}>
            <div className={styles.testimonialImageWrapper}>
              <Image
                src={
                  testimonial.image
                    ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(testimonial.image)}`
                    : baseimage
                }
                alt="CEO Portrait"
                width={400}
                height={400}
                className={styles.testimonialImage}
              />
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
                  <span
                    dangerouslySetInnerHTML={{
                      __html: testimonial?.description
                    }}
                  ></span>
                </p>
                <p className={styles.welcomeText}>
                  <span
                    dangerouslySetInnerHTML={{ __html: testimonial?.quote }}
                  ></span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <LoadingWrapper isLoading={true} />;
  }

  return (
    <div className={styles.aboutSection}>
      <div className={`container ${isMobile ? styles.mobileContainer : ''} container`}>
        {/* Mobile: Show Testimonial first */}
        {isMobile && <TestimonialSection />}

        {/* About Banner */}
        <AboutBanner
          title={cardData?.title || "ABOUT US"}
          description={
            <span
              dangerouslySetInnerHTML={{ __html: cardData?.additional_fields?.testimonials?.[0]?.description }}
            ></span>
          }
        />

        {/* Desktop: Show Testimonial after banner */}
        {!isMobile && <TestimonialSection />}

        {/* Statistics section */}
        <div className={styles.statsSection}>
          {renderStats()}
        </div>

        {/* Agency Section */}
        <div className={styles.agencySection}>
          <h2>{cardData?.additional_fields?.your_agency}</h2>
          <div
            dangerouslySetInnerHTML={{
              __html: cardData?.additional_fields?.your_agency_description
            }}
          ></div>
        </div>

        {/* Team Section */}
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
                    alt="Team Member"
                    width={200}
                    height={200}
                    className={styles.teamImage}
                  />
                </div>
                <h3>{member.title}</h3>
                <p>{member.subtitle_2}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form Section */}
        <div className={styles.formSection}>
          <div className={styles.formContainer}>
            <h5>Send us Email</h5>
            <ContactForm pageTitle="About Page" />
          </div>
        </div>

        {/* Partners Section */}
        <PartnersSection />
      </div>

      {/* Subscribe Section */}
      <div className="container">
        <SubscribeSection />
      </div>
    </div>
  );
};

export default AboutUs;