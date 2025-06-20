import React from "react";
import Image from "next/image";
import Slider from "react-slick";
import styles from "./Clients.module.css";
// Import Slick styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Clients = ({ sectionSixData }) => {
  const googleReviews = sectionSixData?.additional_fields?.google_reviews;
  const testimonials = sectionSixData?.additional_fields?.testimonials || [];
  const title = sectionSixData?.title || "Default Title";
  const subtitle = sectionSixData?.additional_fields?.subtitle || "";
  const ratedText = sectionSixData?.additional_fields?.rated_text || "";

  const settings = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: false,
    className: styles.testimonialSlider,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          
          },
        },
        {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
        {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      ],  
  };

  return (
    <section className={styles.clientsSection}>
      <div className="container">
        <div className={styles.header}>
          <h2>{title}</h2>
          <p>{subtitle}</p>
          <div className={styles.googleReviews}>
            <span>
              {googleReviews?.value || ""}
              {googleReviews?.prefix || ""} {googleReviews?.title || ""}
            </span>
            <span className={styles.rating}>{ratedText}</span>
          </div>
        </div>

        <div className={styles.sliderWrapper}>
          <Slider {...settings}>
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id || `testimonial-${index}`} className={styles.slideItem}>
                <div className={styles.testimonialCard}>
                  <div className={styles.leftQuote}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="82.30" height="56.53" viewBox="0 0 16 16" style={{
                      position: 'absolute',
                      transform: 'rotate(-179.34deg)'
                    }}>
                      <path fill="#E6EBED" d="M12.5 10A3.5 3.5 0 1 1 16 6.5l.016.5a7 7 0 0 1-7 7v-2a4.97 4.97 0 0 0 3.536-1.464a5 5 0 0 0 .497-.578a3.6 3.6 0 0 1-.549.043zm-9 0A3.5 3.5 0 1 1 7 6.5l.016.5a7 7 0 0 1-7 7v-2a4.97 4.97 0 0 0 3.536-1.464a5 5 0 0 0 .497-.578a3.6 3.6 0 0 1-.549.043z"/>
                    </svg>
                  </div>
                  <div className={styles.rightQuote}>
                    <svg
                      viewBox="0 0 53 37"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M40.625 23.5C38.3752 23.5 36.176 22.8329 34.3054 21.583C32.4348 20.3331 30.9768 18.5565 30.1159 16.478C29.2549 14.3995 29.0297 12.1124 29.4686 9.90585C29.9075 7.69932 30.9908 5.67249 32.5817 4.08167C34.1725 2.49084 36.1993 1.40748 38.4058 0.968573C40.6124 0.529666 42.8995 0.754929 44.978 1.61588C47.0565 2.47682 48.8331 3.93479 50.083 5.80539C51.3329 7.676 52 9.87524 52 12.125L52.052 13.75C52.052 16.7376 51.4636 19.6959 50.3203 22.4561C49.177 25.2162 47.5012 27.7242 45.3887 29.8367C43.2761 31.9492 40.7682 33.625 38.0081 34.7683C35.2479 35.9116 32.2896 36.5 29.302 36.5V30C31.4369 30.0057 33.5518 29.5882 35.5243 28.7715C37.4969 27.9548 39.288 26.7552 40.794 25.242C41.3794 24.6579 41.9194 24.0299 42.4093 23.3635C41.8189 23.4556 41.2225 23.5023 40.625 23.5033V23.5ZM11.375 23.5C9.12524 23.5 6.926 22.8329 5.05539 21.583C3.18478 20.3331 1.72682 18.5565 0.865875 16.478C0.00492869 14.3995 -0.220334 12.1124 0.218573 9.90585C0.657479 7.69932 1.74084 5.67249 3.33167 4.08167C4.92249 2.49084 6.94932 1.40748 9.15585 0.968573C11.3624 0.529666 13.6495 0.754929 15.728 1.61588C17.8065 2.47682 19.5831 3.93479 20.833 5.80539C22.0829 7.676 22.75 9.87524 22.75 12.125L22.802 13.75C22.802 19.7837 20.4051 25.5702 16.1387 29.8367C11.8722 34.1031 6.08568 36.5 0.0520051 36.5V30C2.18692 30.0057 4.3018 29.5882 6.27434 28.7715C8.24689 27.9548 10.038 26.7552 11.544 25.242C12.1294 24.6579 12.6694 24.0299 13.1593 23.3635C12.5689 23.4556 11.9725 23.5023 11.375 23.5033V23.5Z"
                        fill="#7ACBC4"
                      />
                    </svg>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.clientProfile}>
                      <Image
                        src={
                          testimonial.photo
                            ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${testimonial.photo}`
                            : "/images/user.png"
                        }
                        alt={testimonial.alt_text || testimonial.name}
                        width={50}
                        height={50}
                        className={styles.clientImage}
                      />
                      <h3>{testimonial.name}</h3>
                      <div className={styles.stars}>
                        {[...Array(Number(testimonial.rating))].map((_, index) => (
                          <span key={index} className={styles.star}>
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="22" viewBox="0 0 24 22" fill="none">
                            <path d="M11.9565 2.79365L14.467 7.93537L14.8551 8.73016L15.4369 8.83911L20.4587 9.53752L16.8913 12.9164L16.2797 13.4898L20.4587 9.53752L14.8551 8.73016L11.9565 2.79365L9.3413 8.68267L3.50434 9.49911L7.63695 13.912L6.97166 13.2016L3.50434 9.49911L8.52608 8.8007L9.3413 8.68267L9.67316 7.93537L11.9565 2.79365ZM12 0L8.29057 7.24464L-5.52855e-06 8.39981L5.99999 14.0416L4.58188 22L12 18.2439L19.4188 22L18 14.0381L24 8.4047L15.7094 7.24464L12 0Z" fill="#FF9500"/>
                            </svg>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div 
                      className={styles.review}
                      dangerouslySetInnerHTML={{ __html: testimonial.body }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Clients;
