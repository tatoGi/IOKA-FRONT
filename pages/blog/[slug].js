import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { BLOGS_API } from '../../routes/apiRoutes';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';

// Dynamically import the BlogShow component with no SSR
const BlogShow = dynamic(
  () => import('../../components/BlogShow/show'),
  { ssr: false, loading: () => <div>Loading...</div> }
);

export async function getStaticPaths() {
  // Pre-render the most popular blog posts at build time
  try {
    const response = await axios.get(BLOGS_API);
    
    // Debug: Log the response structure
    console.log('Blog API Response:', {
      status: response.status,
      statusText: response.statusText,
      dataType: Array.isArray(response.data) ? 'array' : typeof response.data,
      data: response.data
    });
    
    // Handle case where data might be nested in a data property
    const blogPosts = Array.isArray(response.data) 
      ? response.data 
      : (response.data?.data || []);
    
    if (!Array.isArray(blogPosts)) {
      console.error('Unexpected blog posts format:', blogPosts);
      return { paths: [], fallback: 'blocking' };
    }
    
    const paths = blogPosts
      .filter(post => post?.slug) // Only include posts with a slug
      .map((post) => ({
        params: { slug: post.slug },
      }));
      
    console.log(`Generated ${paths.length} blog paths`);
    return { paths, fallback: 'blocking' };
  } catch (error) {
    console.error('Error fetching blog paths:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return { paths: [], fallback: 'blocking' };
  }
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  
  if (!slug) {
    return { notFound: true };
  }
  
  try {
    const response = await axios.get(`${BLOGS_API}/${slug}`);
    
    if (!response.data) {
      return { notFound: true };
    }
    
    return {
      props: { 
        initialBlogData: response.data,
        slug 
      },
      revalidate: 60 * 60, // Revalidate at most once per hour
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return { notFound: true };
  }
}

const BlogShowPage = ({ initialBlogData, slug }) => {
  const router = useRouter();
  const [blogData, setBlogData] = useState(initialBlogData);
  const [isLoading, setIsLoading] = useState(false);

  // Handle client-side data fetching if the page was not pre-rendered
  useEffect(() => {
    const fetchData = async () => {
      if (!blogData && slug) {
        try {
          setIsLoading(true);
          const response = await axios.get(`${BLOGS_API}/${slug}`);
          setBlogData(response.data);
        } catch (error) {
          console.error('Error fetching blog data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchData();
  }, [slug, blogData]);

  if (router.isFallback || isLoading) {
    return <div>Loading...</div>;
  }

  if (!blogData || !blogData.blog) {
    return <div>Blog post not found</div>;
  }

  const breadcrumbData = [
    { title: 'Home', path: '/' },
    { title: 'Blog', path: '/blog' },
    { title: blogData.blog.title || 'Blog Post', path: `/blog/${slug}` }
  ];

  return (
    <div>
      <Breadcrumb breadcrumbData={breadcrumbData} />
      <BlogShow blogData={blogData} />
    </div>
  );
};

// Mark this page as having its own metadata (via BlogShow component)
BlogShowPage.hasMetadata = true;

export default BlogShowPage;
