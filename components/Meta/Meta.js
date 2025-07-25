import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";

const Meta = ({ items }) => {
  const router = useRouter();
  
  // Use require for favicon - access default export to get the path


  // Get the current environment
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Set the base URL based on environment
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (isDevelopment ? 'http://localhost:3000' : 'https://ioka.ae');
  
  // Construct the current URL
  const currentUrl = `${siteUrl}${router.asPath}`;
  
  // Use items prop for metaSettings
  const metaSettings = items || [];

  const getMetaValue = (key) => {
    const setting = metaSettings.find(item => item.key === key);
    return setting?.value || '';
  };

  // Handle image URLs - if it's a relative path, prepend the site URL
  const ogImage = getMetaValue('og_image') ? (getMetaValue('og_image').startsWith('http') ? getMetaValue('og_image') : `${process.env.NEXT_PUBLIC_API_URL}/storage/${getMetaValue('og_image')}`) : `${process.env.NEXT_PUBLIC_API_URL}/assets/img/ioka-logo-white.png`;
  const twitterImage = getMetaValue('twitter_image') ? (getMetaValue('twitter_image').startsWith('http') ? getMetaValue('twitter_image') : `${process.env.NEXT_PUBLIC_API_URL}/storage/${getMetaValue('twitter_image')}`) : `${process.env.NEXT_PUBLIC_API_URL}/assets/img/ioka-logo-white.png`;
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="noindex, nofollow" />
      <meta name="googlebot" content="noindex, nofollow" />

      <meta name="keywords" content={getMetaValue('keywords')} />
      <meta name="description" content={getMetaValue('description')} />
      
      {/* Favicon - SVG format */}
      <link rel="icon" type="image/svg+xml" href="/assets/img/Tiffany-01.svg" />
      <link rel="alternate icon" href="/favicon.ico" />
      
      <meta charSet="utf-8" />
      <title>{getMetaValue('title')}</title>

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={getMetaValue('og_title')} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:description" content={getMetaValue('og_description')} />
      <meta property="og:site_name" content="IOKA Real Estate" />
      <meta property="og:type" content="website" />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content={getMetaValue('twitter_card')} />
      <meta name="twitter:site" content="IOKA Real Estate" />
      <meta name="twitter:title" content={getMetaValue('twitter_title')} />
      <meta name="twitter:description" content={getMetaValue('twitter_description')} />
      <meta name="twitter:image" content={twitterImage} />

      {/* Additional Meta Tags */}
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="IOKA Real Estate" />
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