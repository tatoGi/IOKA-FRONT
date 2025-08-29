import { useEffect } from 'react';
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import usePageMetadata from "@/hooks/usePageMetadata";

const Meta = ({ 
  // For dynamic API fetching
  slug: propSlug = '',
  type = 'page',
  // For direct data passing (recommended)
  data = null,
  // Legacy support
  blogData = null,
  // Developer mode
  developer = false
}) => {
  const router = useRouter();
  const { asPath } = router;
  
  // Use provided slug or get from path
  const slug = propSlug || (asPath === '/' ? 'home' : asPath.replace(/^\//, '').split('?')[0]);

  // Get metadata using the hook only if no direct data is provided
  const directData = data || blogData;
  const shouldFetchMetadata = !directData;
  
  // Clean up the type to remove any path parts
  const cleanType = type ? type.split('/').pop() : 'page';
  
  // Get metadata from API if needed
  const { 
    meta: pageMetadata, 
    loading, 
    error 
  } = usePageMetadata(shouldFetchMetadata ? slug : '', shouldFetchMetadata ? cleanType : null);
  
  // Log any metadata fetching errors and handle loading state
  useEffect(() => {
    if (error) {
      console.error('Metadata error:', error);
    }
  }, [error]);
  
  // Don't render anything while loading in production (only if not using direct data)
  if (process.env.NODE_ENV === 'production' && loading && !directData) {
    return null;
  }
  // Get the current environment
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Set the base URL based on environment
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (isDevelopment ? 'http://localhost:3000' : 'https://ioka.ae');
    
  // Developer mode overrides
  const isDeveloperMode = developer || isDevelopment;
  
  // Construct the current URL
  const currentUrl = `${siteUrl}${asPath}`;
  
  // Default values
  const defaultTitle = 'IOKA Real Estate';
  const defaultDescription = 'Discover premium real estate properties with IOKA';
  const defaultImage = `${process.env.NEXT_PUBLIC_API_URL}/assets/img/ioka-logo-white.png`;
  
  // Handle different types of data (blog, offplan, rental, etc.)
  let metaTitle, metaDescription, metaKeywords, ogTitle, ogDesc, ogImg, twitterTitle, twitterDesc, twitterImg, twitterCardType;
  let contentData = null;
  let contentType = 'website';
  if (directData) {
    // Handle blog data structure
    if (directData.blog) {
      contentData = directData.blog;
      contentType = 'article';
    }
    // Handle offplan data structure
    else if (directData.offplan) {
      contentData = directData.offplan;
      contentType = 'website';
      // Ensure we're using the nested offplan data for metadata
      if (directData.offplan.metadata) {
        contentData.metadata = directData.offplan.metadata;
      }
    }
    // Handle rental data structure
    else if (directData.rental) {
      contentData = directData.rental;
      contentType = 'website';
    }
    // Handle resale data structure
    else if (directData.resale) {
      contentData = directData.resale;
      contentType = 'website';
    }
    // Handle developer data structure
    else if (directData.developer) {
      contentData = directData.developer;
      contentType = 'website';
    }
    // Handle direct content data
    else {
      contentData = directData;
      contentType = type === 'blog' ? 'article' : 'website';
    }
    if (contentData) {
      const metadata = contentData.metadata || {};
      // Extract metadata with fallbacks
      metaTitle = metadata.meta_title || 
                contentData.title || 
                contentData.name || 
                contentData.developer_name || 
                (contentData.offplan?.title) ||
                defaultTitle;
      metaDescription = metadata.meta_description || contentData.subtitle || contentData.description ||
        (contentData.body ? contentData.body.replace(/<[^>]*>/g, '').substring(0, 160) + '...' : defaultDescription);
      metaKeywords = metadata.meta_keywords || '';
      
      // OpenGraph data
      ogTitle = metadata.og_title || metaTitle;
      ogDesc = metadata.og_description || metaDescription;
      ogImg = metadata.og_image || 
        (contentData.banner_image ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${contentData.banner_image}` : 
         contentData.image ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${contentData.image}` : 
         contentData.main_image ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${contentData.main_image}` : defaultImage);
      
      // Twitter data
      twitterTitle = metadata.twitter_title || metaTitle;
      twitterDesc = metadata.twitter_description || metaDescription;
      twitterImg = metadata.twitter_image || ogImg;
      twitterCardType = metadata.twitter_card || 'summary_large_image';
    }
  } else {
    // Use fetched metadata or fallback to defaults
    metaTitle = pageMetadata?.title || defaultTitle;
    metaDescription = pageMetadata?.description || defaultDescription;
    metaKeywords = pageMetadata?.keywords || '';
    
    // Set OpenGraph and Twitter data with fallbacks
    ogTitle = pageMetadata?.og?.title || metaTitle;
    ogDesc = pageMetadata?.og?.description || metaDescription;
    ogImg = pageMetadata?.og?.image || defaultImage;
    
    twitterTitle = pageMetadata?.twitter?.title || ogTitle;
    twitterDesc = pageMetadata?.twitter?.description || ogDesc;
    twitterImg = pageMetadata?.twitter?.image || ogImg;
    twitterCardType = pageMetadata?.twitter?.card || 'summary_large_image';
  }
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {!isDeveloperMode && (
        <>
          <meta name="robots" content="noindex, nofollow" />
          <meta name="googlebot" content="noindex, nofollow" />
        </>
      )}
      <meta charSet="utf-8" />
      <meta name="author" content="IOKA Real Estate" />
      <meta name="revisit-after" content="7 days" />

      {/* Page Title and Description */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={contentType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDesc} />
      <meta property="og:image" content={ogImg} />
      <meta property="og:site_name" content="IOKA Real Estate" />
      {contentData && contentType === 'article' && (
        <>
          <meta property="article:published_time" content={contentData.created_at} />
          <meta property="article:modified_time" content={contentData.updated_at} />
          {contentData.tags && contentData.tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag.replace('#', '')} />
          ))}
        </>
      )}

      {/* Twitter */}
      <meta property="twitter:card" content={twitterCardType} />
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
      
      {/* Developer Mode Indicator */}
      {isDeveloperMode && (
        <meta name="developer-mode" content="enabled" />
      )}
      
      {/* JSON-LD Structured Data */}
      {contentData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": contentType === 'article' ? "BlogPosting" : "WebPage",
              "headline": contentData.title || contentData.name,
              "description": metaDescription,
              "image": ogImg,
              "author": {
                "@type": "Organization",
                "name": "IOKA Real Estate"
              },
              "publisher": {
                "@type": "Organization",
                "name": "IOKA Real Estate",
                "logo": {
                  "@type": "ImageObject",
                  "url": `${siteUrl}/assets/img/ioka-logo-white.png`
                }
              },
              ...(contentType === 'article' && {
                "datePublished": contentData.created_at,
                "dateModified": contentData.updated_at,
                "articleSection": "Real Estate",
                "wordCount": contentData.body ? contentData.body.replace(/<[^>]*>/g, '').split(' ').length : 0
              }),
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": currentUrl
              },
              "keywords": metaKeywords
            })
          }}
        />
      )}
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