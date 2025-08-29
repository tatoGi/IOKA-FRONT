import DeveloperShow from '../../components/DeveloperShow/DeveloperShow';
import axios from 'axios';
import { DEVELOPER_API } from '../../routes/apiRoutes'; // Import the route
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import Meta from '@/components/Meta/Meta';

export const getServerSideProps = async (context) => {
    const { slug } = context.params || {}; // Get the blog slug from the URL path
    if (!slug) {
        return { notFound: true };
    }
    try {
        const response = await axios.get(`${DEVELOPER_API}/${slug}`);
         
        if (!response.data) {
            return { notFound: true };
        }
        return { props: { developerData: response.data } };
    } catch (error) {
        console.error('Error fetching data:', error);
        return { notFound: true };
    }
};

const DeveloperShowPage = ({ developerData  }) => {
    const breadcrumbData = [
        { title: 'Home', path: '/' },
        { title: 'Developer', path: '/developer' },
        { title: developerData.title, path: `/developer/${developerData.slug}` }
    ];
    
    // Prepare metadata for the individual developer page
    const developerMetadata = {
        developer: {
            ...developerData,
            metadata: {
                ...developerData.metadata,
                meta_title: developerData.metadata?.meta_title || developerData.title,
                meta_description: developerData.metadata?.meta_description || developerData.paragraph?.replace(/<[^>]*>/g, '').substring(0, 160) + '...',
                meta_keywords: developerData.metadata?.meta_keywords || 'developer, dubai, real estate',
                og_title: developerData.metadata?.og_title || developerData.metadata?.meta_title || developerData.title,
                og_description: developerData.metadata?.og_description || developerData.metadata?.meta_description,
                og_image: developerData.metadata?.og_image || (developerData.photo ? 
                    `${process.env.NEXT_PUBLIC_API_URL}/storage/${JSON.parse(developerData.photo)[0]?.file}` : 
                    `${process.env.NEXT_PUBLIC_API_URL}/assets/img/developerimg.png`),
                twitter_title: developerData.metadata?.twitter_title || developerData.metadata?.meta_title || developerData.title,
                twitter_description: developerData.metadata?.twitter_description || developerData.metadata?.meta_description,
                twitter_image: developerData.metadata?.twitter_image || developerData.metadata?.og_image,
                twitter_card: developerData.metadata?.twitter_card || 'summary_large_image'
            }
        }
    };
    
    return (
        <>
            <Meta data={developerMetadata} />
            <Breadcrumb breadcrumbData={breadcrumbData} />
            <DeveloperShow developerData={developerData} />
        </>
    );
};
DeveloperShowPage.hasMetadata = true;

export default DeveloperShowPage;
