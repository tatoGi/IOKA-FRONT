import axios from 'axios';
import { OFFPLAN_APi } from '../routes/apiRoutes'; // Import the API route
import Offplan from '@/components/Offplan/Offplan';

export const getServerSideProps = async () => {
    try {
        const response = await axios.get(OFFPLAN_APi); // Fetch initial data
        const data = response.data && response.data.data ? response.data.data : null;
        return { props: { initialData: data, initialPagination: response.data } };
    } catch (error) {
        console.error('Error fetching data:', error);
        return { props: { initialData: null, initialPagination: null } };
    }
};

const OffplanPage = ({ initialData = [], initialPagination }) => {
    return <Offplan initialData={initialData} initialPagination={initialPagination} />;
};

export default OffplanPage;