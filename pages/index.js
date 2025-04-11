import { useEffect, useState } from 'react';
import { LoadingWrapper } from "@/components/LoadingWrapper/index";
import Home from "@/pages/page-components/home";
import { NAVIGATION_MENU } from "@/routes/apiRoutes";
import { useRouter } from 'next/router';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [pageData, setPageData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchHomePage = async () => {
      try {
        const res = await fetch(NAVIGATION_MENU);
        const data = await res.json();
        
        // Find the home page (type_id === 1)
        const homePage = data.pages.find(page => page.type_id === 1);
        
        if (homePage) {
          // Redirect to the home page slug
          router.push(`/${homePage.slug}`);
        }
      } catch (error) {
        console.error("Error fetching home page:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomePage();
  }, [router]);

  if (isLoading) {
    return <LoadingWrapper />;
  }

  return null;
}

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 10
  };
} 