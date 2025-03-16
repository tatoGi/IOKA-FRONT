import axios from 'axios';
import RentalResaleShow from '../../components/Rental_Resale_Show/show';
import { RENTAL_RESALE } from '../../routes/apiRoutes';

export const getServerSideProps = async (context) => {
  const { slug } = context.params || {}; // Get the slug from the URL path


  if (!slug) {
    return { notFound: true };
  }

  try {
    const response = await axios.get(`${RENTAL_RESALE}/${slug}`);
    
    if (!response.data) {
      return { notFound: true };
    }

    return { props: { RENTAL_RESALE_DATA: response.data } };
  } catch (error) {
    console.error('Error fetching data:', error); // Debugging: Log the error
    return { notFound: true };
  }
};

const OffplanShowPage = ({ RENTAL_RESALE_DATA }) => {
  return <RentalResaleShow RENTAL_RESALE_DATA={RENTAL_RESALE_DATA} />;
};

export default OffplanShowPage;