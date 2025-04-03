import Link from "next/link";
import React from "react";
import Image from "next/image";
import Logo from "../../assets/img/ioka-logo-white.png";
import InstagramIcon from "../icons/InstagramIcon";
import LocationIcon from "../icons/LocationIcon";
import MessageIcon from "../icons/MessageIcon";
import PlaneIcon from "../icons/PlaneIcon";
import YoutubeIcon from "../icons/YoutubeIcon";
import FacebookIcon from "../icons/FacebookIcon";
import XIcon from "../icons/XIcon";
import PhoneIcon from "../icons/PhoneIcon";

const Footer = () => {
  return (
    <div className="footer">
      <div className="container">
        <div className="footer-cont">
          {/* Footer Logo */}
          <div className="footer-logo">
            <Link href={"/"}>
              <Image src={Logo} alt="footer-logo" width={138} height={42} />
            </Link>
          </div>

          {/* Mobile-specific order */}
          <div className="mobile-order">
            {/* Footer Contact Section */}
            <div className="footer-contant">
              <div className="contact-text">
                Specializes in providing high-class tours for those in need,
                Contact Us
              </div>
            
            </div>

            {/* Footer Categories */}
            <div className="footer-category">
              <div className="f-category-title">Categories</div>
              <ul>
                <li>
                  <Link href={"#"}>Home</Link>
                </li>
                <li>
                  <Link href={"#"}>Offplan</Link>
                </li>
                <li>
                  <Link href={"#"}>Resale</Link>
                </li>
                <li>
                  <Link href={"#"}>Developers</Link>
                </li>
                <li>
                  <Link href={"#"}>Blog</Link>
                </li>
                <li>
                  <Link href={"#"}>Contact Us</Link>
                </li>
              </ul>
            </div>
            <div className="footer-contact-links">
                <Link href={"#"} className="footer-contact-item">
                  <div className="icon-00">
                    <LocationIcon />
                  </div>
                  <div className="f-text-0">
                    101 E 129th St. East Fujairah IN 45721, UAE
                  </div>
                </Link>
                <Link href={"#"} className="footer-contact-item">
                  <div className="icon-00">
                    <PhoneIcon />
                  </div>
                  <div className="f-text-0">1-333-232-1231</div>
                </Link>
                <Link href={"#"} className="footer-contact-item">
                  <div className="icon-00">
                    <MessageIcon />
                  </div>
                  <div className="f-text-0">example@gmail.com</div>
                </Link>
              </div>
            {/* Social Icons Section */}
            <div className="soc-icons-b">
              <Link href={"#"} className="soc-icon-item">
                <div className="inst-box soc-box">
                  <div className="icon-circle">
                    <InstagramIcon />
                  </div>
                  <div className="soc-title"></div>
                </div>
              </Link>
              <Link href={"#"} className="soc-icon-item">
                <div className="y-box soc-box">
                  <div className="icon-circle">
                    <YoutubeIcon />
                  </div>
                  <div className="soc-title"></div>
                </div>
              </Link>
              <Link href={"#"} className="soc-icon-item">
                <div className="f-box soc-box">
                  <div className="icon-circle">
                    <FacebookIcon />
                  </div>
                  <div className="soc-title"></div>
                </div>
              </Link>
              <Link href={"#"} className="soc-icon-item">
                <div className="x-box soc-box">
                  <div className="icon-circle">
                    <XIcon />
                  </div>
                  <div className="soc-title"></div>
                </div>
              </Link>
            </div>
          </div>

          {/* Desktop-specific order */}
          <div className="desktop-order">
            {/* Footer Box */}
            <div className="footer-box">
              {/* Social Icons Section */}
              <div className="soc-icons-b">
                <div className="follow-text">Follow Us:</div>
                <Link href={"#"} className="soc-icon-item">
                  <div className="inst-box soc-box">
                    <div className="icon-circle">
                      <InstagramIcon />
                    </div>
                    <div className="soc-title">Instagram</div>
                  </div>
                </Link>
                <Link href={"#"} className="soc-icon-item">
                  <div className="y-box soc-box">
                    <div className="icon-circle">
                      <YoutubeIcon />
                    </div>
                    <div className="soc-title">Youtube</div>
                  </div>
                </Link>
                <Link href={"#"} className="soc-icon-item">
                  <div className="f-box soc-box">
                    <div className="icon-circle">
                      <FacebookIcon />
                    </div>
                    <div className="soc-title">Facebook</div>
                  </div>
                </Link>
                <Link href={"#"} className="soc-icon-item">
                  <div className="x-box soc-box">
                    <div className="icon-circle">
                      <XIcon />
                    </div>
                    <div className="soc-title">Twitter</div>
                  </div>
                </Link>
              </div>

              {/* Footer Contact Section */}
              <div className="footer-contant">
                <div className="contact-text">
                  Specializes in providing high-class tours for those in need,
                  Contact Us
                </div>
                <div className="footer-contact-links">
                  <Link href={"#"} className="footer-contact-item">
                    <div className="icon-00">
                      <LocationIcon />
                    </div>
                    <div className="f-text-0">
                      101 E 129th St. East Fujairah IN 45721, UAE
                    </div>
                  </Link>
                  <Link href={"#"} className="footer-contact-item">
                    <div className="icon-00">
                      <PhoneIcon />
                    </div>
                    <div className="f-text-0">1-333-232-1231</div>
                  </Link>
                  <Link href={"#"} className="footer-contact-item">
                    <div className="icon-00">
                      <MessageIcon />
                    </div>
                    <div className="f-text-0">example@gmail.com</div>
                  </Link>
                </div>
              </div>

              {/* Footer Categories */}
              <div className="footer-category">
                <div className="f-category-title">Categories</div>
                <ul>
                  <li>
                    <Link href={"#"}>Home</Link>
                  </li>
                  <li>
                    <Link href={"#"}>Offplan</Link>
                  </li>
                  <li>
                    <Link href={"#"}>Resale</Link>
                  </li>
                  <li>
                    <Link href={"#"}>Developers</Link>
                  </li>
                  <li>
                    <Link href={"#"}>Blog</Link>
                  </li>
                  <li>
                    <Link href={"#"}>Contact Us</Link>
                  </li>
                </ul>
              </div>

              {/* Footer Subscribe */}
              <div className="footer-message">
                <div className="mes-f-title">Newsletter</div>
                <div className="mes-f-text">
                  Your Weekly/Monthly Dose of Knowledge and Inspiration
                </div>
                <form action="#" method="POST">
                  <div className="message-icon-send">
                    <MessageIcon />
                  </div>
                  <input type="text" placeholder="Your Email Address" />
                  <div className="plane-icon">
                    <PlaneIcon />
                  </div>
                  <button type="submit">Get in Touch</button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="copyright-0">
          <div className="l-c">
            ©2024 Copytight Protected All Rights Reserved.
          </div>
          <div className="r-c">
            <ul>
              <li>Terms Of Service</li>
              <li>Privacy Policy</li>
              <li>Cookie Policy</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
