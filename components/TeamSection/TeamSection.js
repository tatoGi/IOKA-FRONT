import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import TeamImage from '../../assets/img/team-1.png'

const TeamSection = () => {
  return (
    <div className="team-section">
        <div className="container">
            <div className="team-all-link">
              <Link  href={"#"} className="team-all-link-touch">
                Get in Touch
              </Link>
            </div>
            <div className="team-box">
              <Link href={'#'} className="team-item">
                  <Image src={TeamImage} alt='member' />
                  <div className="name">
                    John Doe
                  </div>
                  <div className="experience">
                    5+ Yeas Exprience
                  </div>
              </Link>
              <Link href={'#'} className="team-item">
                  <Image src={TeamImage} alt='member' />
                  <div className="name">
                    John Doe
                  </div>
                  <div className="experience">
                    5+ Yeas Exprience
                  </div>
              </Link>
              <Link href={'#'} className="team-item">
                  <Image src={TeamImage} alt='member' />
                  <div className="name">
                    John Doe
                  </div>
                  <div className="experience">
                    5+ Yeas Exprience
                  </div>
              </Link>
            </div>
        </div>
    </div>
  )
}

export default TeamSection