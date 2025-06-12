import React, { useEffect, useState, useCallback } from "react";
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
import { SUBSCRIBE_API } from "@/routes/apiRoutes";

const isMobile = () => {
  if (typeof window !== "undefined") {
    return window.innerWidth <= 768;
  }
  return false;
};

const Footer = ({ navigationData, settings }) => {
  const [mobileView, setMobileView] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

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
    const setting = footerSettings.find(setting => setting.key === key);
    return setting?.value || '';
  };

  const showAlertMessage = useCallback((message) => {
    setAlertMessage(message);
    setShowAlert(true);
    requestAnimationFrame(() => {
      setTimeout(() => {
        requestAnimationFrame(() => {
          setShowAlert(false);
        });
      }, 2000);
    });
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsSubmitting(true);

    try {
      const response = await fetch(SUBSCRIBE_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccess(true);
        setEmail("");
        requestAnimationFrame(() => {
          setTimeout(() => {
            requestAnimationFrame(() => {
              setShowSuccess(false);
            });
          }, 2000);
        });
      } else {
        if (data.errors?.email?.includes("The email has already been taken.")) {
          showAlertMessage("This email is already subscribed. Please use a different email address.");
        } else {
          showAlertMessage("Failed to subscribe. Please try again.");
        }
      }
    } catch (error) {
      showAlertMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [email, showAlertMessage]);

  return (
    <div className="footer">
      <div className="container">
        <div className="footer-cont">
          {/* Footer Logo */}
          <div className="footer-logo">
            <Link href={"/"}>
              <Image 
                src={Logo} 
                alt="footer-logo" 
                width={138} 
                height={42} 
                priority={true}
                loading="eager"
                fetchPriority="high"
                style={{ width: '138px', height: '42px' }}
              />
            </Link>
          </div>

          {/* Mobile-specific order */}
          <div className="mobile-order">
            {/* Footer Contact Section */}
            <div className="footer-contant">
              <div className="contact-text" style={{ color: 'white' }}
                dangerouslySetInnerHTML={{ __html: getSettingValue('description') }}
              />
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
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(getSettingValue('contact.address'))}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-contact-item"
              >
                <div className="icon-00">
                  <LocationIcon />
                </div>
                <div className="f-text-0">
                  {getSettingValue('contact.address')}
                </div>
              </a>
              <a 
                href={`tel:${getSettingValue('contact.phone').replace(/[^\d+]/g, '')}`} 
                className="footer-contact-item"
              >
                <div className="icon-00">
                  <PhoneIcon />
                </div>
                <div className="f-text-0">{getSettingValue('contact.phone')}</div>
              </a>
              <a 
                href={`mailto:${getSettingValue('contact.email')}`} 
                className="footer-contact-item"
              >
                <div className="icon-00">
                  <MessageIcon />
                </div>
                <div className="f-text-0">{getSettingValue('contact.email')}</div>
              </a>
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
                <div className="contact-text"
                  dangerouslySetInnerHTML={{ __html: getSettingValue('description') }}
                />
                <div className="footer-contact-links">
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(getSettingValue('contact.address'))}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="footer-contact-item"
                  >
                    <div className="icon-00">
                      <LocationIcon />
                    </div>
                    <div className="f-text-0">
                      {getSettingValue('contact.address')}
                    </div>
                  </a>
                  <a 
                    href={`tel:${getSettingValue('contact.phone').replace(/[^\d+]/g, '')}`} 
                    className="footer-contact-item"
                  >
                    <div className="icon-00">
                      <PhoneIcon />
                    </div>
                    <div className="f-text-0">{getSettingValue('contact.phone')}</div>
                  </a>
                  <a 
                    href={`mailto:${getSettingValue('contact.email')}`} 
                    className="footer-contact-item"
                  >
                    <div className="icon-00">
                      <MessageIcon />
                    </div>
                    <div className="f-text-0">{getSettingValue('contact.email')}</div>
                  </a>
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
                <div className="mes-f-text"
                  dangerouslySetInnerHTML={{ __html: getSettingValue('newsletter.description') }}
                />
                <form onSubmit={handleSubmit}>
                  <div className="message-icon-send">
                    <MessageIcon />
                  </div>
                  <input 
                    type="email" 
                    placeholder={getSettingValue('newsletter.placeholder') || "Your email"} 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Subscribing...' : (getSettingValue('newsletter.button_text') || 'Subscribe')}
                  </button>
                  {showSuccess && (
                    <div className="alert alert-success">
                      Thank you for subscribing!
                    </div>
                  )}
                  {showAlert && (
                    <div className="alert alert-error">
                      {alertMessage}
                    </div>
                  )}
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
                  <li><Link href="/terms-and-conditions">Terms & Conditions</Link></li>
                  <div className="footer-line"></div>
                  <li><Link href="/privacy-policy">Privacy & Cookies</Link></li>
                  <div className="footer-line"></div>
                  <li><Link href="/faq">FAQ</Link></li>
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
                  <li><Link href="/terms-and-conditions">Terms Of Service</Link></li>
                  <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                  <li><Link href="/faq">FAQ</Link></li>
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
