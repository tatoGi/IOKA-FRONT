import BlogShow from '../../components/BlogShow/show';
import axios from 'axios';
import { BLOGS_API } from '../../routes/apiRoutes'; // Import the route
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';

export const getServerSideProps = async (context) => {
    const { slug } = context.params || {}; // Get the blog slug from the URL path
    if (!slug) {
        return { notFound: true };
    }
    try {
        const response = await axios.get(`${BLOGS_API}/${slug}`);
       
        if (!response.data) {
            return { notFound: true };
        }
        return { props: { blogData: response.data } };
    } catch (error) {
        console.error('Error fetching data:', error);
        return { notFound: true };
    }
};

const BlogShowPage = ({ blogData }) => {
   
    const breadcrumbData = [
        { title: 'Home', path: '/' },
        { title: 'Blog', path: '/blog' },
        { title: blogData.blog.title, path: `/blog/${blogData.blog.slug}` }
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
