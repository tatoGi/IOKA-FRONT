import axios from 'axios';
import Search from '@/components/content/search/list';
import { SEARCH_API } from '@/routes/apiRoutes';

export const getServerSideProps = async ({ query }) => {
  const searchQuery = query.query || '';
  const currentPage = parseInt(query.page, 10) || 1;
  const apiUrl = `${SEARCH_API}?query=${encodeURIComponent(searchQuery)}&page=${currentPage}`;

  try {
    console.log("Fetching from API:", apiUrl);
    const response = await axios.get(apiUrl);
    console.log("API Response Status:", response.status);
    console.log("API Response Data:", response.data);

    const data = response.data || {};
    const searchResults = {
      blogs: data.blogs || { data: [], last_page: 1 },
      pages: data.pages || { data: [], last_page: 1 },
      developers: data.developers || { data: [], last_page: 1 },
      offplans: data.offplans || { data: [], last_page: 1 },
      rental_resales: data.rental_resales || { data: [], last_page: 1 },
    };

    const totalPages = Math.max(
      1,
      ...Object.values(searchResults).map(category => category.last_page || 1)
    );

    return {
      props: {
        searchResults,
        searchQuery,
        currentPage,
        totalPages,
      },
    };
  } catch (error) {
    console.error('Error fetching search results:', error);
    return {
      props: {
        searchResults: {
          blogs: { data: [] },
          pages: { data: [] },
          developers: { data: [] },
          offplans: { data: [] },
          rental_resales: { data: [] },
        },
        searchQuery,
        currentPage: 1,
        totalPages: 1,
      },
    };
  }
};

const SearchPage = ({ searchResults, searchQuery, currentPage, totalPages }) => {
  return <Search results={searchResults} query={searchQuery} currentPage={currentPage} totalPages={totalPages} />;
};

export default SearchPage;