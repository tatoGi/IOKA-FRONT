import axios from 'axios';
import { DEVELOPER_API } from '../routes/apiRoutes'; // Import the new route
import Developer from '@/components/Developer/Developer';

export const getServerSideProps = async () => {
    try {
        const response = await axios.get(DEVELOPER_API); // Fetch initial data
        const data = response.data && response.data.data ? response.data.data : null;
        return { props: { initialData: data, initialPagination: response.data } };
    } catch (error) {
        console.error('Error fetching data:', error);
        return { props: { initialData: null, initialPagination: null } };
    }
};

const DeveloperPage = ({ initialData = [], initialPagination }) => { 
   
    return <Developer initialData={initialData} initialPagination={initialPagination}/>;
};

export default DeveloperPage;
