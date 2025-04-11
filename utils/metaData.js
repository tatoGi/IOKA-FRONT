export const generateMetaData = (pageData, type) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  switch (type) {
    case 'page':
      return {
        title: `${pageData.title} | IOKA Real Estate`,
        description: pageData.desc || 'IOKA Real Estate - Your trusted partner in Dubai real estate',
        image: pageData.image ? `${siteUrl}/storage/${pageData.image}` : `${siteUrl}/assets/img/logo.png`,
        url: `${siteUrl}/${pageData.slug}`,
      };
    
    case 'property':
      return {
        title: `${pageData.title} | IOKA Real Estate`,
        description: pageData.description || 'Premium property in Dubai',
        image: pageData.banner_photo ? `${siteUrl}/storage/${pageData.banner_photo}` : `${siteUrl}/assets/img/logo.png`,
        url: `${siteUrl}/property/${pageData.slug}`,
      };
    
    case 'blog':
      return {
        title: `${pageData.title} | IOKA Blog`,
        description: pageData.description || 'Latest real estate news and insights from IOKA',
        image: pageData.image ? `${siteUrl}/storage/${pageData.image}` : `${siteUrl}/assets/img/logo.png`,
        url: `${siteUrl}/blog/${pageData.slug}`,
      };
    
    case 'developer':
      return {
        title: `${pageData.title} | IOKA Developers`,
        description: pageData.description || 'Leading real estate developer in Dubai',
        image: pageData.logo ? `${siteUrl}/storage/${pageData.logo}` : `${siteUrl}/assets/img/logo.png`,
        url: `${siteUrl}/developer/${pageData.slug}`,
      };
    
    default:
      return {
        title: 'IOKA Real Estate',
        description: 'Your trusted partner in Dubai real estate',
        image: `${siteUrl}/assets/img/logo.png`,
        url: siteUrl,
      };
  }
}; 