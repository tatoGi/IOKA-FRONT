import { generateMetaData } from '@/utils/metaData';
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import BlogShow from '../../components/BlogShow/show';

const BlogShowPage = ({ blogData }) => {
    const breadcrumbData = [
        { title: 'Home', path: '/' },
        { title: 'Blog', path: '/blog' },
        { title: blogData.blog.title, path: `/blog/${blogData.slug}` }
    ];

    // Generate meta data for the blog page
    const metaData = generateMetaData(blogData.blog, 'blog');

    return (
        <div>
            <Breadcrumb breadcrumbData={breadcrumbData} />
            <BlogShow blogData={blogData} />
        </div>
    );
};

export async function getStaticProps({ params }) {
    try {
        const { slug } = params;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${slug}`);
        const blogData = await res.json();

        if (!blogData) {
            return { notFound: true };
        }

        return {
            props: { 
                blogData,
                meta: generateMetaData(blogData.blog, 'blog')
            },
            revalidate: 10
        };
    } catch (error) {
        console.error("Error fetching blog data:", error);
        return { notFound: true };
    }
}

export async function getStaticPaths() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog`);
        const blogs = await res.json();

        const paths = blogs.map((blog) => ({
            params: { slug: blog.slug },
        }));

        return {
            paths,
            fallback: true,
        };
    } catch (error) {
        console.error("Error fetching blog paths:", error);
        return {
            paths: [],
            fallback: true,
        };
    }
}

export default BlogShowPage;