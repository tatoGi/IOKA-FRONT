import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import styles from "./Clients.module.css";

const Clients = ({ sectionSixData }) => {
  const googleReviews = sectionSixData?.additional_fields?.google_reviews;
  const testimonials = sectionSixData?.additional_fields?.testimonials || [];
  const title = sectionSixData?.title || "Default Title"; // Ensure title is defined
  const subtitle = sectionSixData?.additional_fields?.subtitle || ""; // Ensure subtitle is defined
  const ratedText = sectionSixData?.additional_fields?.rated_text || ""; // Ensure rated_text is defined

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

        <Swiper
          spaceBetween={16}
          slidesPerView="auto"
          breakpoints={{
            768: { slidesPerView: 4 },
            576: { slidesPerView: 2 },
            0: { slidesPerView: 1 }
          }}
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide
              key={testimonial.id || `testimonial-${index}`}
              className={styles.testimonialCard}
            >
              <div className={styles.leftQuote}>
                <svg
                  viewBox="0 0 66 58"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.33944 21.5676C4.89648 21.5268 8.38575 22.5417 11.366 24.4839C14.3462 26.4262 16.6836 29.2085 18.0826 32.4792C19.4815 35.7498 19.8792 39.3619 19.2253 42.8585C18.5714 46.3552 16.8953 49.5794 14.4089 52.1235C11.9226 54.6676 8.73771 56.4172 5.25698 57.1512C1.77626 57.8852 -1.84395 57.5706 -5.14585 56.2471C-8.44775 54.9236 -11.283 52.6506 -13.2932 49.7158C-15.3033 46.7809 -16.398 43.3158 -16.4388 39.7588L-16.5505 37.1905C-16.6048 32.4669 -15.7281 27.7789 -13.9705 23.3942C-12.213 19.0094 -9.60902 15.0138 -6.30728 11.6353C-3.00555 8.25694 0.929276 5.56194 5.27254 3.70422C9.6158 1.8465 14.2824 0.86243 19.006 0.808212L19.124 11.0852C15.7484 11.1149 12.4122 11.8134 9.30828 13.1404C6.20437 14.4675 3.39432 16.3967 1.04063 18.8165C0.125613 19.7507 -0.716747 20.7534 -1.47911 21.8158C-0.547461 21.6596 0.39479 21.5749 1.33938 21.5625L1.33944 21.5676ZM47.5858 21.0368C51.1429 20.996 54.6321 22.0109 57.6124 23.9531C60.5926 25.8953 62.93 28.6777 64.329 31.9484C65.7279 35.219 66.1256 38.831 65.4717 42.3277C64.8178 45.8244 63.1417 49.0486 60.6553 51.5927C58.169 54.1367 54.9841 55.8864 51.5034 56.6204C48.0226 57.3544 44.4024 57.0397 41.1005 55.7162C37.7986 54.3927 34.9633 52.1198 32.9532 49.1849C30.9431 46.25 29.8484 42.785 29.8076 39.228L29.6958 36.6597C29.5863 27.12 33.271 17.9275 39.9391 11.1045C46.6072 4.28152 55.7127 0.386882 65.2524 0.277383L65.3703 10.5544C61.9948 10.584 58.6586 11.2826 55.5547 12.6096C52.4508 13.9367 49.6407 15.8659 47.287 18.2857C46.372 19.2199 45.5296 20.2226 44.7673 21.285C45.6989 21.1287 46.6412 21.044 47.5858 21.0317L47.5858 21.0368Z"
                    fill="#0A273B"
                  />
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
                    alt={testimonial.name}
                    width={50}
                    height={50}
                    className={styles.clientImage}
                  />
                  <h3>{testimonial.name}</h3>
                  <div className={styles.stars}>
                    {[...Array(Number(testimonial.rating))].map((_, index) => (
                      <span key={index} className={styles.star}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className={styles.review}>{testimonial.body}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Clients;
