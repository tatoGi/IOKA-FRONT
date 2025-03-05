import React from "react";
import styles from "./blogShow.module.css";
import blogbanner from "../../assets/img/blogbanner.png"; // Ensure this path is correct
import Image from "next/image";
import BlogIcon from "../../assets/img/calendaricon.png"; // Ensure this path is correct
import baseimage from "../../assets/img/blogimage.png"; // Ensure this path is correct
import SubscribeSection from "../SubscribeSection/SubscribeSection";

const BlogShow = () => {
  const cardData = Array(3).fill({
    title: "Advantages of living in Fujairah, UAE",
    date: "06 August, 2024",
    description1:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard."
  });

  return (
    <div>
      <div className={`container ${styles.blogShow}`}>
        <Image src={blogbanner} alt="Banner" />
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-9">
            <h1 className={styles.title}>
              Options for luxury apartments for sale in Colon Street, Valencia
            </h1>
            <div className={styles.date}>
              <Image src={BlogIcon} alt="blogicon" /> <p>06 August, 2024</p>
            </div>
            <div className={styles.description}>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum. Why do we use it?
              </p>
              <p>
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
                The point of using Lorem Ipsum is that it has a more-or-less
                normal distribution of letters, as opposed to using 'Content
                here, content here', making it look like readable English. Many
                desktop publishing packages and web page editors now use Lorem
                Ipsum as their default model text, and a search for 'lorem
                ipsum' will uncover many web sites still in their infancy.
                Various versions have evolved over the years, sometimes by
                accident, sometimes on purpose (injected humour and the like).
              </p>
              <p>
                Where does it come from? Contrary to popular belief, Lorem Ipsum
                is not simply random text. It has roots in a piece of classical
                Latin literature from 45 BC, making it over 2000 years old.
                Richard McClintock, a Latin professor at Hampden-Sydney College
                in Virginia, looked up one of the more obscure Latin words,
                consectetur, from a Lorem Ipsum passage, and going through the
                cites of the word in classical literature, discovered the
                undoubtable source. Lorem Ipsum comes from sections 1.10.32 and
                1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good
                and Evil) by Cicero, written in 45 BC. This book is a treatise
                on the theory of ethics, very popular during the Renaissance.
                The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..",
                comes from a line in section 1.10.32. The standard chunk of
                Lorem Ipsum used since the 1500s is reproduced below for those
                interested. Sections 1.10.32 and 1.10.33 from "de Finibus
                Bonorum et Malorum" by Cicero are also reproduced in their exact
                original form, accompanied by English versions from the 1914
                translation by H. Rackham. Where can I get some?
              </p>
              <p>
                There are many variations of passages of Lorem Ipsum available,
                but the majority have suffered alteration in some form, by
                injected humour, or randomised words which don't look even
                slightly believable. If you are going to use a passage of Lorem
                Ipsum, you need to be sure there isn't anything embarrassing
                hidden in the middle of text. All the Lorem Ipsum generators on
                the Internet tend to repeat predefined chunks as necessary,
                making this the first true generator on the Internet. It uses a
                dictionary of over 200 Latin words, combined with a handful of
                model sentence structures, to generate Lorem Ipsum which looks
                reasonable. The generated Lorem Ipsum is therefore always free
                from repetition
              </p>
            </div>
          </div>
          <div className="col-md-3">
            <div className={styles.sidebar}>
              <h3>Similar Articles</h3>
              {cardData.map((card, index) => (
                <div className={`card ${styles.card}`} key={index}>
                  <Image
                    src={baseimage}
                    className={`card-img-top ${styles["card-img-top"]}`}
                    alt="Image 1"
                  />
                  <div className={`card-body ${styles["card-body"]}`}>
                    <h5 className={`card-title ${styles["card-title"]}`}>
                      {card.title}
                    </h5>
                    <ul className={`list-unstyled ${styles["card-list"]}`}>
                      <li className={`${styles.date}`}>
                        <Image src={BlogIcon} alt="blogicon" /> {card.date}
                      </li>
                      <li>{card.description1}</li>
                    </ul>
                    <a
                      href={`/blog/show?id=${index}`}
                      className={`btn btn-primary ${styles["card-button"]}`}
                    >
                      Read more
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      < SubscribeSection  />
    </div>
  );
};

export default BlogShow;
