import React from "react";
import { useRouter } from "next/router";
import Home from "@/pages/page-components/home";
import Developer from "@/components/Developer/Developer";
import About from "@/pages/page-components/about";
import Contact from "@/pages/page-components/contact";
import OffPlan from "@/pages/page-components/offplan";
import Rental_Resale from "@/pages/page-components/rentalResale";
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import Blog from "@/pages/page-components/blog";

const DynamicPage = ({ pageData }) => {
  const router = useRouter();

  // If the page is not yet generated, show a loading state
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  // Check if pageData or pageData.title is null or undefined
  if (!pageData || !pageData.title) {
    return <div>Page data is not available.</div>;
  }

  const pathSegments = pageData.title.split('/'); // Use slug to create breadcrumb segments

  // Generate breadcrumb data dynamically
  const breadcrumbData = pathSegments.map((segment, index) => ({
    title: segment ? segment.replace(/-/g, " ").charAt(0).toUpperCase() + segment.slice(1) : "", // Safeguard against null/undefined segment
    path: `/${pathSegments.slice(0, index + 1).join('/')}`, // Generate full path
  }));

  // Render the appropriate component based on the page's type_id
  const renderPage = () => {
    switch (pageData.type_id) {
      case 1: // Home Page
        return <Home />;
      case 2: // About Page
        return <About />;
      case 3: // Contact Page
        return <Contact />;
      case 4: // Off-Plan Page
        return <OffPlan />;
      case 5: // Rental/Resale Page
        return <Rental_Resale />;
      case 6: // Blog Page
        return <Blog />;
      case 7: // Developer Page
        return <Developer />;
      default:
        return (
          <div>
            <h1>{pageData.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: pageData.desc }} />
          </div>
        );
    }
  };

  return (
    <div>
      {/* Render Breadcrumb only if type_id is not 1 */}
      {pageData.type_id !== 1 && (
        <Breadcrumb breadcrumbData={[{ title: 'Home', path: '/' }, ...breadcrumbData]} />
      )}
      {/* Render the page content */}
      {renderPage()}
    </div>
  );
};

export default DynamicPage;

// Fetch all possible paths for dynamic pages
export async function getStaticPaths() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages`);
  const data = await res.json();
  const pages = data.pages;

  // Filter out duplicate slugs
  const uniquePages = pages.filter(
    (page, index, self) =>
      index === self.findIndex((p) => p.slug === page.slug)
  );

  // Generate paths for each unique slug
  const paths = uniquePages.map((page) => ({
    params: { slug: page.slug },
  }));

  return {
    paths,
    fallback: true,
  };
}

// Fetch page data for a specific slug
export async function getStaticProps({ params }) {
  try {
    const { slug } = params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages`);
    
    if (!res.ok) {
      throw new Error(`Failed to fetch, status: ${res.status}`);
    }

    const data = await res.json();
    const pageData = data.pages.find((page) => page.slug === slug);

    // Log for debugging
    console.log("Fetched pages:", data.pages);
    console.log("Looking for slug:", slug);

    if (!pageData) {
      return { notFound: true };
    }

    return {
      props: { pageData },
      revalidate: 10, // Revalidate the page every 10 seconds
    };
  } catch (error) {
    console.error("Error fetching page data:", error);
    return { notFound: true };
  }
}
