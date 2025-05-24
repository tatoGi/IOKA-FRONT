import Head from "next/head";
import { useRouter } from "next/router";

const Meta = ({ items }) => {
  const router = useRouter();

  // Get the current environment
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Set the base URL based on environment
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (isDevelopment ? 'http://localhost:3000' : 'https://ioka-front.vercel.app/');
  
  // Construct the current URL
  const currentUrl = `${siteUrl}${router.asPath}`;
  
  // Use items prop for metaSettings
  const metaSettings = items || [];

  const getMetaValue = (key) => {
    const setting = metaSettings.find(item => item.key === key);
    return setting?.value || '';
  };

  // Handle image URLs - if it's a relative path, prepend the site URL
  const ogImage = getMetaValue('og_image') ? (getMetaValue('og_image').startsWith('http') ? getMetaValue('og_image') : `${siteUrl}/storage/${getMetaValue('og_image')}`) : `${siteUrl}/assets/img/ioka-logo-white.png`;
  const twitterImage = getMetaValue('twitter_image') ? (getMetaValue('twitter_image').startsWith('http') ? getMetaValue('twitter_image') : `${siteUrl}/storage/${getMetaValue('twitter_image')}`) : `${siteUrl}/assets/img/ioka-logo-white.png`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

      <meta name="keywords" content={getMetaValue('keywords')} />
      <meta name="description" content={getMetaValue('description')} />
      <link rel="icon" href="/favicon.ico" />
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
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="IOKA Real Estate" />
    </Head>
  );
};

export default Meta;