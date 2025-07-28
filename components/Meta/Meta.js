import { useEffect } from 'react';
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import usePageMetadata from "@/hooks/usePageMetadata";

const Meta = ({ 
  title = 'IOKA Real Estate',
  description = 'Discover premium real estate properties with IOKA',
  keywords = '',
  og_title = '',
  og_description = '',
  og_image = '',
  twitter_card = 'summary_large_image',
  twitter_title = '',
  twitter_description = '',
  twitter_image = '',
  // Pass the slug and type to fetch metadata dynamically
  slug: propSlug = '',
  type = 'page'
}) => {
  const router = useRouter();
  const { asPath } = router;
  
  // Use provided slug or get from path
  const slug = propSlug || (asPath === '/' ? 'home' : asPath.replace(/^\//, '').split('?')[0]);
  
  // Get metadata using the hook
  const { 
    meta: pageMetadata, 
    loading, 
    error 
  } = usePageMetadata(slug, type);
  
  // Log any metadata fetching errors and handle loading state
  useEffect(() => {
    if (error) {
      console.error('Metadata error:', error);
    }
  }, [error]);
  
  // Don't render anything while loading in production
  if (process.env.NODE_ENV === 'production' && loading) {
    return null;
  }
  
  // Get the current environment
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Set the base URL based on environment
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (isDevelopment ? 'http://localhost:3000' : 'https://ioka.ae');
  
  // Construct the current URL
  const currentUrl = `${siteUrl}${asPath}`;
  
  // Default values
  const defaultTitle = 'IOKA Real Estate';
  const defaultDescription = 'Discover premium real estate properties with IOKA';
  const defaultImage = `${process.env.NEXT_PUBLIC_API_URL}/assets/img/ioka-logo-white.png`;
  
  // Set metadata values with fallbacks
  const metaTitle = pageMetadata?.title || title || defaultTitle;
  const metaDescription = pageMetadata?.description || description || defaultDescription;
  const metaKeywords = pageMetadata?.keywords || keywords || '';
  
  // Set OpenGraph and Twitter data with fallbacks
  const ogTitle = pageMetadata?.og?.title || og_title || metaTitle || defaultTitle;
  const ogDesc = pageMetadata?.og?.description || og_description || metaDescription || defaultDescription;
  const ogImg = pageMetadata?.og?.image || og_image || defaultImage;
  
  const twitterTitle = pageMetadata?.twitter?.title || twitter_title || ogTitle || defaultTitle;
  const twitterDesc = pageMetadata?.twitter?.description || twitter_description || ogDesc || defaultDescription;
  const twitterImg = pageMetadata?.twitter?.image || twitter_image || ogImg || defaultImage;
  const twitterCard = pageMetadata?.twitter?.card || twitter_card || 'summary_large_image';
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="noindex, nofollow" />
      <meta name="googlebot" content="noindex, nofollow" />
      <meta charSet="utf-8" />
      <meta name="author" content="IOKA Real Estate" />
      <meta name="revisit-after" content="7 days" />

      {/* Page Title and Description */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDesc} />
      <meta property="og:image" content={ogImg} />
      <meta property="og:site_name" content="IOKA Real Estate" />

      {/* Twitter */}
      <meta property="twitter:card" content={twitterCard} />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={twitterTitle} />
      <meta property="twitter:description" content={twitterDesc} />
      <meta property="twitter:image" content={twitterImg} />
      <meta name="twitter:site" content="@ioka" />
      <meta name="twitter:creator" content="@ioka" />
      
      {/* Favicon and Canonical */}
      <link rel="canonical" href={currentUrl} />
      <link rel="icon" type="image/svg+xml" href="/assets/img/Tiffany-01.svg" />
      <link rel="alternate icon" href="/favicon.ico" />
      {/* Meta Pixel Code */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '759035466469582');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=759035466469582&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
      {/* End Meta Pixel Code */}
    </Head>
  );
};

export default Meta;