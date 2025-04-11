import React from 'react';
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { NAVIGATION_MENU } from "@/routes/apiRoutes";
import SubscribeSection from '@/components/SubscribeSection/SubscribeSection';

const TermsAndConditions = ({ pageData }) => {
  const breadcrumbData = [
    { title: "Home", path: "/" },
    { title: "Terms and Conditions", path: "/terms-and-conditions" }
  ];

  return (
    <div className="container">
      <Breadcrumb breadcrumbData={breadcrumbData} />
      <div className="terms-content">
        <h1>TERMS AND CONDITIONS</h1>
        
        <div className="content-section">
          <h2>User's Terms</h2>
          <p>Unique Properties Broker is providing this website to you for informational purposes only. Usage of the site indicates automatic agreement with these terms and conditions.</p>
        </div>

        <div className="content-section">
          <h2>Corrections</h2>
          <p>Unique Properties Broker is not obligated to correct, make updates to, or otherwise make modifications to any of the material contained on the site. While Unique Properties Broker will always do everything it can to ensure the information on the site is timely and accurate, both typographical and factual errors may occur. These errors are accidental and Unique Properties Broker is not to be held liable for them. Additionally, some site information may become out-of-date over time. Unique Properties Broker will endeavor to keep information as up-to-date as possible but is not to be held responsible for this type of material if it does occur.</p>
        </div>

        <div className="content-section">
          <h2>Information</h2>
          <p>All information contained on the Unique Properties Broker website is to be regarded as informational in purpose only. No information on the Unique Properties Broker website is to be regarded as substitution for legal, financial, or any other kind of counsel. Individuals seeking advice on real estate matters are encouraged to contact one of the experienced agents on the Unique Properties Broker team for any information that they may be seeking.</p>
        </div>

        <div className="content-section">
          <h2>Copyright</h2>
          <p>All content on this website, including photographs, articles, and content is protected by copyright owned by Unique Properties Broker. Any commercial use of information from the Unique Properties website is strictly forbidden.</p>
        </div>

        <div className="content-section">
          <h2>Unsolicited Email</h2>
          <p>Unique Properties Broker does not make use of unsolicited email. You will only be contacted by Unique Properties Broker if you give your information to one of our agents for use in facilitating the purchase, sale, or rental of a property, or if you give us your information for any other purpose, such as seeking out a career opportunity with the company.</p>
        </div>

        <div className="content-section">
          <p>These terms and conditions are subject to change. Any changes that are made will be updated to this page as soon as possible and without any further notice to the site user.</p>
        </div>
      </div>
      <SubscribeSection />
    </div>
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

export default TermsAndConditions; 