import Search from '@/components/Search/Search'
import React from 'react';

const List = ({ results, query, currentPage, totalPages }) => {
  return (
    <Search results={results} query={query} currentPage={currentPage} totalPages={totalPages} />
  );
};

export default List;