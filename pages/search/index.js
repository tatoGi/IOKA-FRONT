import SearchPage, { getServerSideProps } from "@/pages/page-components/search"; // Import getServerSideProps

export { getServerSideProps }; // Re-export getServerSideProps

const Searching = (props) => {
  return ( // Ensure JSX is returned
    <div>
      <SearchPage {...props} />
    </div>
  );
};

export default Searching;