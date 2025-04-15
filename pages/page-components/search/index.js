import axios from 'axios';
import Search from '@/components/content/search/list';
import { SEARCH_API } from '@/routes/apiRoutes';

export const getServerSideProps = async ({ query }) => {
  const searchQuery = query.query || '';
  const apiUrl = `${SEARCH_API}?query=${encodeURIComponent(searchQuery)}`;
  
  try {
    console.log("Fetching from API:", apiUrl);
    const response = await axios.get(apiUrl);
    console.log("API Response Status:", response.status);
    console.log("API Response Data:", response.data);

    const data = response.data || {};
    const searchResults = {
      blogs: data.blogs || [],
      pages: data.pages || [],
      developers: data.developers || [],
      offplans: data.offplans || [],
      rental_resales: data.rental_resales || [],
    };

    return { 
      props: { 
        searchResults, 
        searchQuery 
      } 
    };
  } catch (error) {
    console.error('Error fetching search results:', error);
    return { 
      props: { 
        searchResults: {
          blogs: [],
          pages: [],
          developers: [],
          offplans: [],
          rental_resales: [],
        }, 
        searchQuery 
      } 
    };
  }
};

const SearchPage = ({ searchResults, searchQuery }) => {
  return <Search results={searchResults} query={searchQuery} />;
};

export default SearchPage;