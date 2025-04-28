import React, { useEffect, useState } from 'react';
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { NAVIGATION_MENU } from "@/routes/apiRoutes";
import callVector from "../assets/img/call.svg";
import whatsappVector from "../assets/img/whatsapp.svg";
import Image from "next/image";
import SubscribeSection from "@/components/SubscribeSection/SubscribeSection";
import axios from "axios";
import { FAQ_API } from "@/routes/apiRoutes";
import { useMediaQuery } from 'react-responsive';
const FAQ = ({ pageData }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const breadcrumbData = [
    { title: "Home", path: "/" },
    { title: "FAQ", path: "/faq" }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axios.get(FAQ_API);
        setFaqs(response.data.faqs || []); // Set the faqs data to state
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        setFaqs([]); // Set empty array if error occurs
      }
    };

    fetchFaqs();
  }, []);
  const isMobileView = useMediaQuery({ query: '(max-width: 768px)' });
  useEffect(() => {
    setIsMobile(isMobileView);
  }, [isMobileView]);
  return (
    <>
      <Breadcrumb breadcrumbData={breadcrumbData} />
      <div className="container faq-container">
        <div className="row">
          {isMobileView ? (
            <div className="col-12">
              <h1>Frequently Asked Questions</h1>
              <div className="faq-list">
                {faqs.map((faq, index) => (
                  <div key={index} className={`faq-item ${activeIndex === index ? 'active' : ''}`}>
                    <div 
                      className="faq-question" 
                      onClick={() => toggleFAQ(index)}
                    >
                      <h3>{faq.question}</h3>
                      <span className={`arrow ${activeIndex === index ? 'active' : ''}`}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19.9201 8.94995L13.4001 15.47C12.6301 16.24 11.3701 16.24 10.6001 15.47L4.08008 8.94995" stroke="#0A273B" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>
                    <div className={`faq-answer ${activeIndex === index ? 'active' : ''}`}>
                      <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: '#fff', borderRadius: 16, padding: 24, marginTop: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 24 }}>
                <p className="question-text" style={{ fontWeight: 600 }}>Do you have any questions ?</p>
                <p className="contact-text">If you have any questions, just contact and ask us, we'll be glad to assist you.</p>
                <button className="enquire-btn" style={{ width: '100%', marginBottom: 16 }}>Enquire Now</button>
                <div className="contact-buttons-faq" style={{ display: 'flex', gap: 8 }}>
                  <button className="call-btn" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Image src={callVector} alt="call" />
                    <span style={{ marginLeft: 8 }}>Call</span>
                  </button>
                  <button className="whatsapp-btn" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Image src={whatsappVector} alt="whatsapp" />
                    <span style={{ marginLeft: 8 }}>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="col-md-6">
                <div className="faq-left">
                  <h1>Frequently Asked Questions</h1>
                  <div className="title-line"></div>
                  <p className="question-text">Do you have any questions?</p>
                  <p className="contact-text">If you have any questions, just contact and ask us, we'll be glad to assist you.</p>
                  <button className="enquire-btn">Enquire Now</button>
                  <div className="contact-buttons-faq">
                    <button className="call-btn">
                      <Image src={callVector} alt="call" />
                      Call
                    </button>
                    <button className="whatsapp-btn">
                      <Image src={whatsappVector} alt="whatsapp" />
                      WhatsApp
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="faq-right">
                  <div className="faq-list">
                    {faqs.map((faq, index) => (
                      <div key={index} className={`faq-item ${activeIndex === index ? 'active' : ''}`}>
                        <div 
                          className="faq-question" 
                          onClick={() => toggleFAQ(index)}
                        >
                          <h3>{faq.question}</h3>
                          <span className={`arrow ${activeIndex === index ? 'active' : ''}`}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M19.9201 8.94995L13.4001 15.47C12.6301 16.24 11.3701 16.24 10.6001 15.47L4.08008 8.94995" stroke="#0A273B" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                        </div>
                        <div className={`faq-answer ${activeIndex === index ? 'active' : ''}`}>
                          <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <SubscribeSection />
      </div>
    </>
  );
};

export async function getStaticProps() {
  try {
    const res = await fetch(NAVIGATION_MENU);
    const data = await res.json();

    return {
      props: {
        pageData: data
      },
      revalidate: 10
    };
  } catch (error) {
    console.error("Error fetching navigation data:", error);
    return {
      props: {
        pageData: null
      }
    };
  }
}

export default FAQ;