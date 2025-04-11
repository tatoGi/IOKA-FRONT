import React, { useState } from 'react';
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { NAVIGATION_MENU } from "@/routes/apiRoutes";
import callVector from "../assets/img/call.svg";
import whatsappVector from "../assets/img/whatsapp.svg";
import Image from "next/image";
import SubscribeSection from "@/components/SubscribeSection/SubscribeSection";
const FAQ = ({ pageData }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const breadcrumbData = [
    { title: "Home", path: "/" },
    { title: "FAQ", path: "/faq" }
  ];

  const faqs = [
    {
      question: "What are the pros & cons of buying off-plan vs ready properties?",
      answer: "Off-plan properties often offer lower prices and payment plans, but come with completion risks. Ready properties provide immediate possession but usually cost more upfront."
    },
    {
      question: "What are the steps to buy an off-plan property?",
      answer: "The process includes selecting a property, signing a sale agreement, making the initial payment, and following the payment plan until completion."
    },
    {
      question: "What are the steps to buy a ready property?",
      answer: "Steps include property viewing, negotiation, signing the MOU, making payments, and transferring ownership at the land department."
    },
    {
      question: "How can I ensure that I find the property that suits my investment or lifestyle needs?",
      answer: "Work with reputable agents, research the market thoroughly, consider your long-term goals, and inspect properties carefully before making a decision."
    },
    {
      question: "Is Life Insurance mandatory for taking a mortgage in the UAE?",
      answer: "Yes, life insurance is typically mandatory when taking out a mortgage in the UAE to protect the lender's interests."
    },
    {
      question: "What are the recurring fees that homeowners pay in Dubai?",
      answer: "Homeowners in Dubai typically pay service charges, DEWA bills, chiller fees, and annual property maintenance costs."
    },
    {
      question: "Is there any mortgage available for off-plan property in Dubai?",
      answer: "Yes, some banks offer mortgages for off-plan properties, but terms and conditions vary based on the development stage and developer."
    },
    {
      question: "Is Dubai a good place to live?",
      answer: "Dubai offers a high quality of life with excellent infrastructure, safety, tax benefits, and multicultural environment, making it attractive for many expats."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
     <Breadcrumb breadcrumbData={breadcrumbData} />
     <div className="container faq-container">
        <div className="row">
          <div className="col-md-6">
            <div className="faq-left">
              <h1>Frequently Asked Questions</h1>
              <div className="title-line"></div>
              <p className="question-text">Do you have any questions ?</p>
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
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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