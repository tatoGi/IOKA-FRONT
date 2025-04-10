import SearchPage from "../page-components/searchforhome";

export async function getServerSideProps(context) {
  return {
    props: {
      query: context.query
    }
  };
}

export default function HomeSearch({ query }) {
  return <SearchPage searchParams={query} />;
}
