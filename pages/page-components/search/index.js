import axios from 'axios';
import Search from '@/components/content/search/list';
import { SEARCH_API } from '@/routes/apiRoutes';

export const getServerSideProps = async ({ query }) => {
  const searchQuery = query.query || '';
  const apiUrl = `${SEARCH_API}?query=${encodeURIComponent(searchQuery)}`;
  try {
    console.log("Fetching from API:", apiUrl); // Log API URL
    const response = await axios.get(apiUrl);
    console.log("API Response Status:", response.status); // Log response status
    console.log("API Response Data:", response.data); // Log response data

    const data = response.data || {};
    const searchResults = {
      blogs: data.blogs || [],
      pages: data.pages || [],
      developers: data.developers || [],
      offplans: data.offplans || [],
      rental_resales: data.rental_resales || [],
    };

    return { props: { searchResults, searchQuery } };
  } catch (error) {
    console.error('Error fetching search results:', error);
    return { props: { searchResults: {}, searchQuery } };
  }
};

const SearchPage = ({ searchResults, searchQuery }) => {
  console.log("Search Query:", searchQuery); // Log search query
  console.log("Search Results:", searchResults); // Log search results
  return (
    <div>
      <Search results={searchResults} query={searchQuery} />
    </div>
  );
};

export default SearchPage;