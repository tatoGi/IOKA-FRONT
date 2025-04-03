import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const TeamSection = ({ sectionDataFive }) => {
  const decodeImageUrl = (url) => {
    return decodeURIComponent(url);
  };
  const MainTitle = sectionDataFive?.additional_fields?.title || 'Default Title';
  const TeamMembers = sectionDataFive?.additional_fields?.team_members || [];
  const redirectLink = sectionDataFive?.additional_fields?.Redirect_Link || '#'; // Provide a default value

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
                  member.image
                    ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeImageUrl(member.image)}`
                    : homeBanner
                }
                alt="member"
                width={200}
                height={200}
                className="team-member-image"
              />
              <div className="name">{member.title}</div>
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