import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import TeamImage from '../../assets/img/team-1.png';

const TeamSection = () => {
  return (
    <div className="team-section">
      <div className="container">
        <div className="team-all-link">
          <Link href={"#"} className="team-all-link-touch">
            ABOUT US
          </Link>
        </div>
        <div className="team-box">
          <div className="team-item">
            <Image src={TeamImage} alt='member' />
            <div className="name">John Doe</div>
            <div className="experience">5+ Years Experience</div>
          </div>
          <div className="team-item">
            <Image src={TeamImage} alt='member' />
            <div className="name">Max Musterman</div>
            <div className="experience">5+ Years Experience</div>
          </div>
          <div className="team-item">
            <Image src={TeamImage} alt='member' />
            <div className="name">John Lenon</div>
            <div className="experience">5+ Years Experience</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSection;