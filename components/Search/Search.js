import React, { useState, useEffect } from "react";
import styles from './search.module.css';
import Image from "next/image";
import Link from "next/link";
import searchResultimg from "../../assets/img/search_svgrepo.com.png";
import { useRouter } from 'next/router';

const SearchResult = ({ results = {}, query, currentPage, totalPages }) => {
  
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(query || '');
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const totalResults = Object.values(results).reduce((acc, category) => {
    return acc + (category?.total || 0);
  }, 0);

  useEffect(() => {
    setIsClient(true);
    const checkIsMobile = () => setIsMobile(window.innerWidth <= 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const transformCategoryName = (category) => {
    const categoryMap = {
      'blogs': 'blog',
      'developers': 'developer',
      'offplans': 'offplan',
      'rental_resales': 'rental',
      'pages': 'page'
    };
    return categoryMap[category] || category;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push({
        pathname: '/search',
        query: { query: searchQuery.trim(), page: 1 }
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages && page !== currentPage) {
      router.push({
        pathname: '/search',
        query: { ...router.query, page }
      });
    }
  };

  return (
    <>
      <div className={styles.searchBanner}>
        <div className={styles.bannerOverlay}></div>
        <div className={styles.bannerContent}>
          <h2>IOKA Development</h2>
          <h1>INSPIRED BY BUGATTI HYPERCARS, THIS ARCHITECTURAL MASTERPIECE</h1>
        </div>
      </div>
      
      <div className={styles.searchBox}>
        <input 
          type="text" 
          placeholder="Search..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className={styles.searchInput}
        />
        <button 
          className={styles.searchButton}
          onClick={handleSearch}
          aria-label="Search properties"
          type="submit"
        >
          Search
        </button>
      </div>
    
    <div className={styles.searchResultsContainer}>
      <div className="container">
          <div className={styles.searchResults}>
            <div className={styles.searchHeader}>
              <h2>Search Results for "{query}"</h2>
              <p>{totalResults} Results Found</p>
            </div>

            {isClient && (
              totalResults === 0 ? (
                <div className={styles.noResults}>
                  <div className={styles.noResultsContent}>
                    <div className={styles.noResultsIcon}>
                      <Image
                        src={searchResultimg}
                        alt="No results"
                        width={48}
                        height={48}
                      />
                    </div>
                    <h3>No results found</h3>
                    <p>Sorry, we couldn't find any results for this search.</p>
                    <p>Please try searching with another term</p>
                  </div>
                </div>
              ) : (
                <div className={styles.resultsGrid}>
                  {Object.entries(results).map(([category, items]) =>
                    (items && Array.isArray(items.data) ? items.data : []).map((item, index) => {
                      if (!item) return null;
                      const uniqueKey = `${category}-${item.id || index}-${index}`;
                      const transformedCategory = transformCategoryName(category);
                      return (
                        <div key={uniqueKey} className={styles.resultCard}>
                          <div className={styles.breadcrumbs}>
                            <span>
                              <Link href="/">Home</Link>  &gt; <Link href={`/${transformedCategory}/${item.slug}`}>{item.slug}</Link>
                            </span>
                          </div>
                          <Link href={`/${transformedCategory}/${item.slug}`} className={styles.resultLink}>
                            <div className={styles.resultDetails}>
                              <h4>{item.title}</h4>
                              {item.subtitle && <p className={styles.subtitle}>{item.subtitle}</p>}
                              {item.amount && <p className={styles.price}>AED {item.amount}</p>}
                              {item.paragraph && <p className={styles.excerpt}>{item.paragraph.replace(/<[^>]*>/g, '').substring(0, 150)}...</p>}
                            </div>
                          </Link>
                        </div>
                      );
                    })
                  ).flat()}
                </div>
              )
            )}

            {totalPages > 1 && (
              <div className={styles.pagination}>
                {isMobile ? (
                  <div className={`${styles.mobilePagination} container`}>
                    <button
                      className={styles.pageButtonmobile}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
                        <path d="M0.293359 6.29414C-0.0972656 6.68477 -0.0972656 7.31914 0.293359 7.70977L6.29336 13.7098C6.68398 14.1004 7.31836 14.1004 7.70898 13.7098C8.09961 13.3191 8.09961 12.6848 7.70898 12.2941L2.41523 7.00039L7.70586 1.70664C8.09648 1.31602 8.09648 0.681641 7.70586 0.291016C7.31523 -0.100391 6.68086 -0.100391 6.29023 0.291016L0.290234 6.29102L0.293359 6.29414Z" fill="#07151F"/>
                      </svg>
                    </button>
                    <div className={styles.pageInfo}>
                      <span className={styles.pageText}>Page</span>
                      <select
                        className={styles.pageSelect}
                        value={currentPage}
                        onChange={(e) => handlePageChange(Number(e.target.value))}
                      >
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                          (page) => (
                            <option key={page} value={page}>
                              {page}
                            </option>
                          )
                        )}
                      </select>
                      <span className={styles.pageTotal}>of {totalPages}</span>
                    </div>
                    <button
                      className={styles.pageButtonmobile}
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
                        <path d="M7.70664 7.70586C8.09727 7.31523 8.09727 6.68086 7.70664 6.29023L1.70664 0.290234C1.31602 -0.100391 0.681641 -0.100391 0.291016 0.290234C-0.0996094 0.680859 -0.0996094 1.31523 0.291016 1.70586L5.58477 6.99961L0.29414 12.2934C-0.0964847 12.684 -0.0964847 13.3184 0.29414 13.709C0.684765 14.0996 1.31914 14.0996 1.70977 13.709L7.70977 7.70898L7.70664 7.70586Z" fill="#07151F"/>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={styles.pageButton}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
                        <path d="M0.293359 6.29414C-0.0972656 6.68477 -0.0972656 7.31914 0.293359 7.70977L6.29336 13.7098C6.68398 14.1004 7.31836 14.1004 7.70898 13.7098C8.09961 13.3191 8.09961 12.6848 7.70898 12.2941L2.41523 7.00039L7.70586 1.70664C8.09648 1.31602 8.09648 0.681641 7.70586 0.291016C7.31523 -0.100391 6.68086 -0.100391 6.29023 0.291016L0.290234 6.29102L0.293359 6.29414Z" fill="currentColor"/>
                      </svg>
                    </button>

                    {currentPage > 3 && (
                      <button onClick={() => handlePageChange(1)} className={styles.pageButton}>1</button>
                    )}
                    {currentPage > 4 && <span className={styles.ellipsis}>...</span>}

                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page = currentPage > 2 ? currentPage - 2 + i : i + 1;
                      if (page > totalPages) return null;
                      if (totalPages > 5 && currentPage > totalPages - 3) {
                        page = totalPages - 4 + i;
                      }
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    {currentPage < totalPages - 3 && <span className={styles.ellipsis}>...</span>}
                    {currentPage < totalPages - 2 && (
                      <button onClick={() => handlePageChange(totalPages)} className={styles.pageButton}>{totalPages}</button>
                    )}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={styles.pageButton}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
                        <path d="M7.70664 7.70586C8.09727 7.31523 8.09727 6.68086 7.70664 6.29023L1.70664 0.290234C1.31602 -0.100391 0.681641 -0.100391 0.291016 0.290234C-0.0996094 0.680859 -0.0996094 1.31523 0.291016 1.70586L5.58477 6.99961L0.29414 12.2934C-0.0964847 12.684 -0.0964847 13.3184 0.29414 13.709C0.684765 14.0996 1.31914 14.0996 1.70977 13.709L7.70977 7.70898L7.70664 7.70586Z" fill="currentColor"/>
                      </svg>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
      </div>
    </div>
    </>
  );
};

export default SearchResult;
