import axios from 'axios';
import { DEVELOPER_API } from '../routes/apiRoutes'; // Import the new route
import Developer from '@/components/Developer/Developer';

export const getServerSideProps = async () => {
    try {
        const response = await axios.get(DEVELOPER_API); // Fetch data from the new URL
        const data = response.data && response.data.data ? response.data.data : null;
        return { props: { initialData: data } };
    } catch (error) {
        console.error('Error fetching data:', error);
        return { props: { initialData: null } }; // Return null instead of undefined
    }
};

const DeveloperPage = ({ initialData = [] }) => { 
   
    return <Developer initialData={initialData} />;
};

export default DeveloperPage;
