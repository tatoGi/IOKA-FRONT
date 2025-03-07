import Blog from '../components/Blog/Blog';
import axios from 'axios';
import { BLOGS_API } from '../routes/apiRoutes'; // Import the route

export const getServerSideProps = async () => {
    try {
        const response = await axios.get(BLOGS_API);
        return { props: { initialData: response.data.data } };
    } catch (error) {
        console.error('Error fetching data:', error);
        return { props: { initialData: [] } };
    }
};

const BlogPage = ({ initialData }) => {
    return <Blog initialData={initialData} />;
};

export default BlogPage;
