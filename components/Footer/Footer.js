import React, { useEffect, useState } from "react";
import Link from "next/link";
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

const isMobile = () => {
  if (typeof window !== "undefined") {
    return window.innerWidth <= 768;
  }
  return false;
};

const Footer = ({ navigationData, settings }) => {
  const [mobileView, setMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => setMobileView(isMobile());
    handleResize(); // Check on initial render
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter and sort pages for footer categories
  const footerPages = navigationData
    ?.filter((page) => page.active === 1)
    .sort((a, b) => a.sort - b.sort);

  // Get footer settings
  const footerSettings = settings?.footer || [];
  const socialSettings = settings?.social || [];

  // Helper function to get setting value by key
  const getSettingValue = (key) => {
    return footerSettings.find(setting => setting.key === key)?.value || '';
  };

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
                {getSettingValue('description')}
              </div>
            </div>

            {/* Footer Categories */}
            <div className="footer-category">
              <div className="f-category-title">Categories</div>
              <ul>
                {footerPages?.map((page) => (
                  <li key={page.id}>
                    <Link href={`/${page.slug}`}>{page.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer-contact-links">
              <Link href={"#"} className="footer-contact-item">
                <div className="icon-00">
                  <LocationIcon />
                </div>
                <div className="f-text-0">
                  {getSettingValue('contact.address')}
                </div>
              </Link>
              <Link href={"#"} className="footer-contact-item">
                <div className="icon-00">
                  <PhoneIcon />
                </div>
                <div className="f-text-0">{getSettingValue('contact.phone')}</div>
              </Link>
              <Link href={"#"} className="footer-contact-item">
                <div className="icon-00">
                  <MessageIcon />
                </div>
                <div className="f-text-0">{getSettingValue('contact.email')}</div>
              </Link>
            </div>
            {/* Social Icons Section */}
            <div className="soc-icons-b">
              {socialSettings.map((social) => (
                <Link key={social.id} href={social.value} className="soc-icon-item">
                  <div className={`${social.key}-box soc-box`}>
                    <div className="icon-circle">
                      {social.key === 'facebook' && <FacebookIcon />}
                      {social.key === 'twitter' && <XIcon />}
                      {social.key === 'instagram' && <InstagramIcon />}
                      {social.key === 'youtube' && <YoutubeIcon />}
                    </div>
                    <div className="soc-title"></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop-specific order */}
          <div className="desktop-order">
            {/* Footer Box */}
            <div className="footer-box">
              {/* Social Icons Section */}
              <div className="soc-icons-b">
                <div className="follow-text">Follow Us:</div>
                {socialSettings.map((social) => (
                  <Link key={social.id} href={social.value} className="soc-icon-item">
                    <div className={`${social.key}-box soc-box`}>
                      <div className="icon-circle">
                        {social.key === 'facebook' && <FacebookIcon />}
                        {social.key === 'twitter' && <XIcon />}
                        {social.key === 'instagram' && <InstagramIcon />}
                        {social.key === 'youtube' && <YoutubeIcon />}
                      </div>
                      <div className="soc-title">{social.key.charAt(0).toUpperCase() + social.key.slice(1)}</div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Footer Contact Section */}
              <div className="footer-contant">
                <div className="contact-text">
                  {getSettingValue('description')}
                </div>
                <div className="footer-contact-links">
                  <Link href={"#"} className="footer-contact-item">
                    <div className="icon-00">
                      <LocationIcon />
                    </div>
                    <div className="f-text-0">
                      {getSettingValue('contact.address')}
                    </div>
                  </Link>
                  <Link href={"#"} className="footer-contact-item">
                    <div className="icon-00">
                      <PhoneIcon />
                    </div>
                    <div className="f-text-0">{getSettingValue('contact.phone')}</div>
                  </Link>
                  <Link href={"#"} className="footer-contact-item">
                    <div className="icon-00">
                      <MessageIcon />
                    </div>
                    <div className="f-text-0">{getSettingValue('contact.email')}</div>
                  </Link>
                </div>
              </div>

              {/* Footer Categories */}
              <div className="footer-category">
                <div className="f-category-title">Categories</div>
                <ul>
                  {footerPages?.map((page) => (
                    <li key={page.id}>
                      <Link href={`/${page.slug}`}>{page.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer Subscribe */}
              <div className="footer-message">
                <div className="mes-f-title">{getSettingValue('newsletter.title')}</div>
                <div className="mes-f-text">
                  {getSettingValue('newsletter.description')}
                </div>
                <form action="#" method="POST">
                  <div className="message-icon-send">
                    <MessageIcon />
                  </div>
                  <input type="text" placeholder={getSettingValue('newsletter.placeholder')} />
                  <div className="plane-icon">
                    <PlaneIcon />
                  </div>
                  <button type="submit">{getSettingValue('newsletter.button_text')}</button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="copyright-0">
          {mobileView ? (
            <>
              <div className="r-c">
                <ul>
                  <li>Terms & Conditions</li>
                  <div className="footer-line"></div>
                  <li>Privacy & Cookies</li>
                </ul>
              </div>
              
              <div className="l-c">
                {getSettingValue('copyright')}
              </div>
            </>
          ) : (
            <>
              <div className="l-c">
                {getSettingValue('copyright')}
              </div>
              <div className="r-c">
                <ul>
                  <li>Terms Of Service</li>
                  <li>Privacy Policy</li>
                  <li>Cookie Policy</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Footer;
