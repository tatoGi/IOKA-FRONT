'use client';
import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import SubscribeSection with no SSR
const SubscribeSection = dynamic(() => import('../SubscribeSection/SubscribeSection'), {
  ssr: true,

});

const SharedLayout = ({ children, showSubscribe = true }) => {
  return (
    <>
      {children}
      {showSubscribe && (
        <div className="container">
          <SubscribeSection />
        </div>
      )}
    </>
  );
};

export default SharedLayout; 