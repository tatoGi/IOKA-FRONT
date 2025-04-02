import Search from '@/components/Search/Search'
import React from 'react';

const List = ({ results, query }) => {
  return (
    <div>
  <Search results={results} query={query} />
    </div>
    
  );
};

export default List;