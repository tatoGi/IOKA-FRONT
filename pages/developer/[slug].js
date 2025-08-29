import DeveloperShow from '../../components/DeveloperShow/DeveloperShow';
import axios from 'axios';
import { DEVELOPER_API } from '../../routes/apiRoutes'; // Import the route
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';

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
        { title: 'Blog', path: '/blog' },
        { title: developerData.title, path: `/blog/${developerData.slug}` }
    ];
    return (
        <div>
            <Breadcrumb breadcrumbData={breadcrumbData} />
            <DeveloperShow developerData={developerData} />
        </div>
    );
};
DeveloperShowPage.hasMetadata = true;

export default DeveloperShowPage;
