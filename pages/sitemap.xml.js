import { SETTINGS_API } from "@/routes/apiRoutes";

const Sitemap = () => {};

export async function getServerSideProps({ res }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ioka-front.vercel.app';

  // Fetch all necessary data
  const [pagesRes, propertiesRes, settingsRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages`),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties`),
    fetch(SETTINGS_API)
  ]);

  const [pages, properties, settings] = await Promise.all([
    pagesRes.json(),
    propertiesRes.json(),
    settingsRes.json()
  ]);

  // Define static pages
  const staticPages = [
    '',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-conditions',
    '/faq',
    '/careers'
  ];

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticPages
        .map((page) => {
          return `
            <url>
              <loc>${baseUrl}${page}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>${page === '' ? 'daily' : 'weekly'}</changefreq>
              <priority>${page === '' ? '1.0' : '0.8'}</priority>
            </url>
          `;
        })
        .join('')}
      ${pages.pages
        ?.map((page) => {
          return `
            <url>
              <loc>${baseUrl}/${page.slug}</loc>
              <lastmod>${new Date(page.updated_at || page.created_at).toISOString()}</lastmod>
              <changefreq>weekly</changefreq>
              <priority>0.7</priority>
            </url>
          `;
        })
        .join('')}
      ${properties.properties
        ?.map((property) => {
          return `
            <url>
              <loc>${baseUrl}/property/${property.slug}</loc>
              <lastmod>${new Date(property.updated_at || property.created_at).toISOString()}</lastmod>
              <changefreq>weekly</changefreq>
              <priority>0.8</priority>
            </url>
          `;
        })
        .join('')}
    </urlset>
  `;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap; 