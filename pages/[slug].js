import React from "react";
import { useRouter } from "next/router";
import Home from "@/components/HomeBanner/Hombanner";
import Developer from "@/components/Developer/Developer";
import About from "@/components/AboutUs/AboutUs";
import Contact from "@/components/Contact/Contact";
import OffPlan from "@/components/Offplan/Offplan";
import Rental_Resale from "@/components/Rental_Resale/Rental_Resale";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Blog from "@/components/Blog/Blog";
import Meta from "@/components/Meta/Meta";

const DynamicPage = ({ pageData }) => {
 
  const router = useRouter();

  // Check if pageData or pageData.title is null or undefined
  if (!pageData || !pageData.title) {
    return <div>Page data is not available.</div>;
  }

  // Generate breadcrumb data dynamically, ensuring no null or undefined segmentsalt
  const breadcrumbData = [
    { title: pageData.title, path: `/pages/${pageData.slug}` }
  ];

  // Render the appropriate component based on the page's type_id
  const renderPage = () => {
    switch (pageData.type_id) {
      case 1: // Home Page
        return <Home />;
      case 2: // About Page
        return <About id={pageData.id} />;
      case 3: // Contact Page
        return <Contact id={pageData.id} />;
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
    <>
      <Meta 
        slug={pageData.slug}
        type="page"
        title={pageData.title}
        description={pageData.desc}
        keywords={pageData.keywords}
      />
      {pageData.breadcrumb && <Breadcrumb data={breadcrumbData} />}
      {renderPage()}
    </>
  );
};
export async function getStaticPaths() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages`);
    // Check if the response is successful
    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    // Check if the response is JSON
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('API did not return JSON');
    }

    const data = await res.json();
    const pages = data.pages;
    // Filter out routes that conflict with explicit Next.js pages (case-insensitive)
    const RESERVED_TOP_LEVEL = new Set([
      'blog',
    ]);
    // Generate paths from the pages data
    const paths = pages
      .filter((page) => page?.slug && !RESERVED_TOP_LEVEL.has(String(page.slug).toLowerCase()))
      .map((page) => ({
        params: { slug: page.slug },
      }));

    return {
      paths,
      fallback: false, // or 'blocking' if you want to enable fallback
    };
  } catch (error) {
    console.error('Error in getStaticPaths:', error);
    // Return an empty paths array in case of error
    return {
      paths: [],
      fallback: false,
    };
  }
}
export async function getStaticProps({ params }) {
  try {
    const { slug } = params;
    
    // Handle the root path (`/`)
    const isRootPath = slug === "/";

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages`);

    if (!res.ok) {
      throw new Error(`Failed to fetch, status: ${res.status}`);
    }

    const data = await res.json();
    let pageData;
   
    // If the slug is the root path (`/`), find the home page
    if (isRootPath) {
      pageData = data.pages.find((page) => page.type_id === 1); // Home page type_id
      if (!pageData) {
        // If no home page found, create a default one
        pageData = {
          id: 0,
          title: "Home",
          slug: "/",
          type_id: 1,
          desc: ""
        };
      }
    } else {
      // Otherwise, find the page by slug
      pageData = data.pages.find((page) => page.slug === slug);
    }

    if (!pageData) {
      return { notFound: true };
    }

    // Ensure metadata is included in the page props
    const pageProps = {
      pageData: {
        ...pageData,
        // Make sure metadata is properly structured
        metadata: pageData.metadata || {
          title: pageData.title,
          description: pageData.desc,
          // Add any other default meta fields you need
        }
      }
    };

    return {
      props: pageProps,
      revalidate: 10 // Revalidate the page every 10 seconds
    };
  } catch (error) {
    console.error("Error fetching page data:", error);
    return { notFound: true };
  }
}
export default DynamicPage;
