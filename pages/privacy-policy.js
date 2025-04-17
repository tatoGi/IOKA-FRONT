import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import SubscribeSection from "@/components/SubscribeSection/SubscribeSection";
import axios from "axios";
import { POLICY_API } from "@/routes/apiRoutes";

const PrivacyPolicy = () => {
  const [policyData, setPolicyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const breadcrumbData = [
    { title: "Home", path: "/" },
    { title: "Privacy Policy", path: "/privacy-policy" }
  ];

  useEffect(() => {
    const fetchPolicyData = async () => {
      try {
        const response = await axios.get(POLICY_API);
        setPolicyData(response.data);
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
        <div className="privacy-policy-content">
          <h1>Privacy Policy</h1>

          <div
            className="content-section"
            dangerouslySetInnerHTML={{ __html: policyData.privacy_policy }}
          />

          {/* If needed, render other policies here */}
          {/* <div dangerouslySetInnerHTML={{ __html: policyData.cookie_policy }} /> */}
          {/* <div dangerouslySetInnerHTML={{ __html: policyData.terms_agreement }} /> */}
        </div>
        <SubscribeSection />
      </div>
    </>
  );
};

export default PrivacyPolicy;
