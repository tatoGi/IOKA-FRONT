import SearchPagehome from "@/pages/page-components/searchforhome";

export async function getServerSideProps(context) {
  // Extract and validate query parameters
  const { query } = context;
  
  // You can add validation or transformation here if needed
  const validatedQuery = {
    type: query.type || 'offplan', // default to 'offplan'
    location: query.location || '',
    sizeMin: query.sizeMin ? parseInt(query.sizeMin) : undefined,
    sizeMax: query.sizeMax ? parseInt(query.sizeMax) : undefined,
    priceMin: query.priceMin ? parseInt(query.priceMin) : undefined,
    priceMax: query.priceMax ? parseInt(query.priceMax) : undefined,
    bathMin: query.bathMin ? parseInt(query.bathMin) : undefined,
    bathMax: query.bathMax ? parseInt(query.bathMax) : undefined,
    currency: query.currency || 'AED'
  };

  // Remove undefined values
  Object.keys(validatedQuery).forEach(key => {
    if (validatedQuery[key] === undefined) {
      delete validatedQuery[key];
    }
  });

  return {
    props: {
      searchParams: validatedQuery
    }
  };
}

const Searchinghome = ({ searchParams }) => {
  return (
    <div>
      <SearchPagehome searchParams={searchParams} />
    </div>
  );
};

export default Searchinghome;