import SearchPage, { getServerSideProps } from "@/pages/page-components/search"; // Import getServerSideProps

export { getServerSideProps }; // Re-export getServerSideProps

const Searching = (props) => {
  return ( <SearchPage {...props} /> );
};

export default Searching;