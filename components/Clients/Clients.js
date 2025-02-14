import React from "react";
import Image from "next/image";
import styles from "./Clients.module.css";
import client1 from "../../assets/img/client-1.png";

const testimonials = [
  {
    id: 1,
    name: "Pascal Macault",
    rating: 5,
    image: client1,
    review:
      "Anna provided a great support with all the steps of the transaction. She invested a lot of time to find our dream home and simplified all procedures till hand over. Her extensive knowledge of the market is a key support for new buyers."
  },
  {
    id: 2,
    name: "Pascal Macault",
    rating: 5,
    image: client1,
    review:
      "Anna provided a great support with all the steps of the transaction. She invested a lot of time to find our dream home and simplified all procedures till hand over. Her extensive knowledge of the market is a key support for new buyers."
  },
  {
    id: 3,
    name: "Pascal Macault",
    rating: 5,
    image: client1,
    review:
      "Anna provided a great support with all the steps of the transaction. She invested a lot of time to find our dream home and simplified all procedures till hand over. Her extensive knowledge of the market is a key support for new buyers."
  },
  {
    id: 4,
    name: "Pascal Macault",
    rating: 5,
    image: client1,
    review:
      "Anna provided a great support with all the steps of the transaction. She invested a lot of time to find our dream home and simplified all procedures till hand over. Her extensive knowledge of the market is a key support for new buyers."
  }
];

const Clients = () => {
  return (
    <section className={styles.clientsSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>What our clients say</h2>
          <p>
            Don't just take our word for it. Here's what our clients have to say
            about their Unique experience.
          </p>
          <div className={styles.googleReviews}>
            <span>250+ Google Reviews</span>
            <span className={styles.rating}>Rated 4.8/5</span>
          </div>
        </div>

        <div className={styles.testimonialGrid}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className={styles.testimonialCard}>
              <div className={styles.quoteIcon}>"</div>
              <div className={styles.clientInfo}>
                <div className={styles.clientImage}>
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={50}
                    height={50}
                  />
                </div>
                <h3>{testimonial.name}</h3>
                <div className={styles.rating}>
                  {[...Array(testimonial.rating)].map((_, index) => (
                    <span key={index} className={styles.star}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className={styles.review}>{testimonial.review}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;
