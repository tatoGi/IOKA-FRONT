import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import SubscribeSection with no SSR
const SubscribeSection = dynamic(() => import('../SubscribeSection/SubscribeSection'), {
  ssr: false,
  loading: () => <div className="subscribe-section-loading">Loading...</div>
});

const SharedLayout = ({ children }) => {
  return (
    <>
      {children}
      <div className="container">
        <SubscribeSection />
      </div>
    </>
  );
};

export default SharedLayout; 