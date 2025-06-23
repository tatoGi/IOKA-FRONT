import React from "react";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { useRouter } from "next/router";
import Head from "next/head";

const ThankYou = () => {
  const router = useRouter();
  
  const breadcrumbData = [
    { title: "Home", path: "/" },
    { title: "Thank You", path: "/thank-you" }
  ];

  return (
    <>
      <Head>
        <title>Thank You | Ioka</title>
        <meta name="description" content="Thank you for contacting us" />
      </Head>
      
      <Breadcrumb breadcrumbData={breadcrumbData} />
      
      <div className="container">
        <div className="thank-you-content" style={{ textAlign: 'center', padding: '60px 0' }}>
          <h1>Thank You for Contacting Us</h1>
          
          <div className="content-section" style={{ margin: '30px 0' }}>
            <p>Your message has been successfully sent. We appreciate your interest and will get back to you as soon as possible.</p>
          </div>
          
          <button 
            onClick={() => router.push('/')}
            style={{
              backgroundColor: '#2D61A6',
              color: 'white',
              padding: '15px 30px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '16px',
              marginTop: '20px'
            }}
          >
            Return to Homepage
          </button>
        </div>
      </div>
    </>
  );
};

export default ThankYou;
