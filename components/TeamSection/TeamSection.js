import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';


const TeamSection = ({ sectionDataFive }) => {
  
  const [isMobile, setIsMobile] = useState(false);
  const decodeImageUrl = (url) => {
    return decodeURIComponent(url);
  };
  const MainTitle = sectionDataFive?.additional_fields?.title || 'Default Title';
  const TeamMembers = sectionDataFive?.additional_fields?.team_members || [];
  const redirectLink = sectionDataFive?.additional_fields?.Redirect_Link || '#'; // Provide a default value
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Check if screen width is <= 768px
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize); // Add resize listener
    return () => window.removeEventListener("resize", handleResize); // Cleanup listener
  }, []);
  return (
    <div className="team-section">
      <div className="container-lg">
        <div className="team-all-link">
          <Link href={redirectLink} className="team-all-link-touch">
            {MainTitle}
          </Link>
        </div>
        <div className="team-box">
          {TeamMembers.map((member, index) => (
            <div className="team-item" key={index}>
              <Image
                src={
                  (member.mobile_image && isMobile)
                    ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(member.mobile_image)}`
                    : member.image
                      ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(member.image)}`
                      : '/assets/img/default.webp' // fallback image
                }
                alt={member.alt_text || "member"}
                width={200}
                height={200}
                className="team-member-image"
                quality={80}
              />
              <div className="name">{member.title}</div>
              <div className="experience">{member.subtitle_1}</div>
              <div className="experience">{member.subtitle_2}</div>
            </div>
          ))}
        </div>
        <div className="team-button">
          <Link href={redirectLink}>
            <button className="get-in-touch-button">Get in Touch</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeamSection;