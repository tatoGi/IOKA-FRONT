import Head from "next/head";
import { useRouter } from "next/router";
import Logo from "../../assets/img/ioka-logo-white.png";
const Meta = ({
  title = "IOKA - Your Trusted Real Estate Partner",
  keywords = "real estate, property, Dubai, UAE, investment, luxury homes, apartments, villas",
  description = "IOKA is your trusted real estate partner in Dubai, offering premium properties, expert guidance, and exceptional service for all your real estate needs.",
  url = "",
  image = "/assets/img/ioka-logo-white.png",
  site = "IOKA Real Estate",
  type = "website",
}) => {
  const router = useRouter();
  
  // Get the current environment
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Set the base URL based on environment
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (isDevelopment ? 'http://localhost:3000' : 'https://ioka-front.vercel.app/');
  
  // Construct the current URL
  const currentUrl = url || `${siteUrl}${router.asPath}`;
  
  // Handle image URLs - if it's a relative path, prepend the site URL
  const defaultImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />

      <meta name="keywords" content={keywords} />
      <meta name="description" content={description} />
      <link rel="icon" href="/favicon.ico" />
      <meta charSet="utf-8" />
      <title>{title}</title>

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={defaultImage} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={site} />
      <meta property="og:type" content={type} />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={site} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={defaultImage} />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="IOKA Real Estate" />
    </Head>
  );
};

export default Meta;