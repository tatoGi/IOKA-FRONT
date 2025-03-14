import axios from 'axios';
import OffplanShow from '../../components/OffplanShow/show';
import { OFFPLAN_APi } from '../../routes/apiRoutes';

export const getServerSideProps = async (context) => {
  const { slug } = context.params || {}; // Get the slug from the URL path

  console.log('Slug:', slug); // Debugging: Log the slug

  if (!slug) {
    return { notFound: true };
  }

  try {
    const response = await axios.get(`${OFFPLAN_APi}/${slug}`);
  
    if (!response.data) {
      return { notFound: true };
    }

    return { props: { offplanData: response.data } };
  } catch (error) {
    console.error('Error fetching data:', error); // Debugging: Log the error
    return { notFound: true };
  }
};

const OffplanShowPage = ({ offplanData }) => {
  return <OffplanShow offplanData={offplanData} />;
};

export default OffplanShowPage;