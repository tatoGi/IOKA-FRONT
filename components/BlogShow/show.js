import React from "react";
import { useRouter } from 'next/router'; // Import useRouter from next/router
import styles from "./blogShow.module.css";
import blogbanner from "../../assets/img/blogbanner.png"; // Ensure this path is correct
import Image from "next/image";
import BlogIcon from "../../assets/img/calendaricon.png"; // Ensure this path is correct
import baseimage from "../../assets/img/blogimage.png"; // Ensure this path is correct
import SubscribeSection from "../SubscribeSection/SubscribeSection";

const BlogShow = ({ blogData }) => {
  
  const router = useRouter(); // Initialize useRouter

  if (!blogData) {
    return <div>No blog data available</div>;
  }
  const decodeImageUrl = (url) => {
    return decodeURIComponent(url);
};
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const limitTextLength = (text, maxLength) => {
    const strippedText = text.replace(/(<([^>]+)>)/gi, ""); // Remove HTML tags
    return strippedText.length > maxLength ? strippedText.substring(0, maxLength) + "..." : strippedText;
};
const handleReadMore = (slug) => {
  router.push(`/blog/${slug}`);
};
  return (
    <div>
      <div className={`container ${styles.blogShow}`}>
        <Image 
          src={blogData.blog.banner_image ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(blogData.blog.banner_image )}` : baseimage} 
          alt={blogData.blog.banner_image_alt} 
          width={800} 
          height={400} 
        />
      </div>
      <div className="container">
       
        <div className="row">
          <div className="col-md-9">
            
            <h1 className={styles.title}>{blogData.blog.title}</h1>
            <div className={styles.date}>
              <Image src={BlogIcon} alt="blogicon" width={20} height={20} /> 
              <p className={styles.formattedDate}>{formatDate(blogData.blog.date)}</p>
            </div>
            <div className={styles.description}>
              <div dangerouslySetInnerHTML={{ __html: blogData.blog.body }} /> {/* Display the blog body */}
            </div>
          </div>
          <div className="col-md-3">
            <div className={styles.sidebar}>
              <h3>Similar Articles</h3>
              {blogData.related_blogs && blogData.related_blogs.map((card, index) => (
                <div className={`card ${styles.card}`} key={index}>
                  <Image
                    src={card.image ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(card.image)}` : baseimage} 
                    className={`card-img-top ${styles["card-img-top"]}`}
                    alt={card.image_alt} 
                    width={150}
                    height={100}
                  />
                  <div className={`card-body ${styles["card-body"]}`}>
                    <h5 className={`card-title ${styles["card-title"]}`}>
                      {card.title}
                    </h5>
                    <ul className={`list-unstyled ${styles["card-list"]}`}>
                      <li className={`${styles.date}`}>
                        <Image src={BlogIcon} alt="blogicon" width={20} height={20} /> 
                        <span className={styles.formattedDate}>{formatDate(card.date)}</span>
                      </li>
                      <li>{limitTextLength(card.body, 108)}</li>
                    </ul>
                    <button onClick={() => handleReadMore(card.slug)} className={`btn btn-primary ${styles['card-button']}`}>Read more</button>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <SubscribeSection />
    </div>
  );
};

export default BlogShow;
