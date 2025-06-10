import React, { useState, useEffect } from 'react';
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { NAVIGATION_MENU } from "@/routes/apiRoutes";
import axios from 'axios';
import { POLICY_API } from "@/routes/apiRoutes";

const TermsAndConditions = () => {
  const [termsAgreement, setTermsAgreement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const breadcrumbData = [
    { title: "Home", path: "/" },
    { title: "Terms and Conditions", path: "/terms-and-conditions" }
  ];

  useEffect(() => {
    const fetchPolicyData = async () => {
      try {
        const response = await axios.get(POLICY_API);
        setTermsAgreement(response.data.terms_agreement);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicyData();
  }, []);

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container">Error: {error}</div>;

  return (
    <>
    <Breadcrumb breadcrumbData={breadcrumbData} />
    <div className="container">

      <div className="terms-content">
        <h1>TERMS AND CONDITIONS</h1>
        <div
          className="content-section"
          dangerouslySetInnerHTML={{ __html: termsAgreement }} />
      </div>
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

export default TermsAndConditions;
