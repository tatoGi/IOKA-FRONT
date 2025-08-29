import { useEffect } from 'react';
import Head from "next/head";
import { useRouter } from "next/router";

/**
 * Meta Component for handling page metadata and SEO
 * @param {Object} props - Component props
 * @param {Object} props.data - Direct metadata object from API response
 * @param {string} [props.data.title] - Page title
 * @param {string} [props.data.description] - Page description
 * @param {Object} [props.data.og] - OpenGraph metadata
 * @param {string} [props.data.og.title] - OG title
 * @param {string} [props.data.og.description] - OG description
 * @param {string} [props.data.og.image] - OG image URL
 * @param {Object} [props.data.twitter] - Twitter card metadata
 * @param {string} [props.data.twitter.card] - Twitter card type
 * @param {string} [props.data.twitter.title] - Twitter title
 * @param {string} [props.data.twitter.description] - Twitter description
 * @param {string} [props.data.twitter.image] - Twitter image URL
 * @param {string} [props.data.keywords] - Meta keywords
 * @param {boolean} [developer=false] - Enable developer mode (disables noindex)
 */
const Meta = ({
  data = {},
  developer = false
}) => {
  const router = useRouter();
  const { asPath } = router;
  
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
  
  if (data) {
    console.log(data);
    // Handle blog data structure
    if (data.blog) {
      contentData = data.blog;
      contentType = 'article';
    }
    // Handle offplan data structure
    else if (data.offplan) {
      contentData = data.offplan;
      contentType = 'website';
      // Ensure we're using the nested offplan data for metadata
      if (data.offplan.metadata) {
        contentData.metadata = data.offplan.metadata;
      }
    }
    // Handle rental data structure
    else if (data.rental) {
      contentData = data.rental;
      contentType = 'website';
    }
    // Handle resale data structure
    else if (data.resale) {
      contentData = data.resale;
      contentType = 'website';
    }
    // Handle developer data structure
    else if (data.developer) {
      contentData = data.developer;
      contentType = 'website';
    }
    // Handle direct content data
    else {
      contentData = data;
      contentType = 'website';
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
        (contentData.banner_image ? 
          `${process.env.NEXT_PUBLIC_API_URL}/storage/${contentData.banner_image}` : 
          defaultImage
        );
    }
  } else {
    // Default values if no metadata is available
    metaTitle = defaultTitle;
    metaDescription = defaultDescription;
    metaKeywords = '';
    ogTitle = metaTitle;
    ogDesc = metaDescription;
    ogImg = defaultImage;
    twitterTitle = metaTitle;
    twitterDesc = metaDescription;
    twitterImg = defaultImage;
    twitterCardType = 'summary_large_image';
  }
  
  // Set Twitter values
  twitterTitle = twitterTitle || ogTitle;
  twitterDesc = twitterDesc || ogDesc;
  twitterImg = twitterImg || ogImg;
  twitterCardType = twitterCardType || 'summary_large_image';
  
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