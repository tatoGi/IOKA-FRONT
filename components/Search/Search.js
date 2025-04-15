import React, { useState, useEffect } from "react";
import styles from './search.module.css';
import Image from "next/image";
import Link from "next/link";
import defaultImage from "../../assets/img/blogimage.png";
import { useRouter } from 'next/router';

const decodeImageUrl = (url) => {
  return decodeURIComponent(url);
};

const SearchResult = ({ results = {}, query }) => {
   console.log(results);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(query || '');
  const [isClient, setIsClient] = useState(false);
  const totalResults = Object.values(results).flat().length;

  // Get the frontend URL based on environment

  // Function to transform category names
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push({
        pathname: '/search',
        query: { query: searchQuery.trim() }
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
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
        >
          Search
        </button>
      </div>
    
      

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
                  <h3>No results found</h3>
                  <p>Sorry, we couldn't find any results for this search.</p>
                  <p>Please try searching with another term</p>
                </div>
              </div>
            ) : (
              <div className={styles.resultsGrid}>
                {Object.entries(results).map(([category, items]) => 
                  items.map((item, index) => {
                    
                    if (!item) return null;
                    const uniqueKey = `${category}-${item.id || index}-${index}`;
                    const transformedCategory = transformCategoryName(category);
                    return (
                      <div key={uniqueKey} className={styles.resultCard}>
                        <div className={styles.breadcrumbs}>
                          <span>
                            <Link href="/">Home</Link>  &gt; <Link href={`${transformedCategory}/${item.slug}`} style={{color: '#7ACBC4'}}>{item.slug}</Link>
                          </span>
                        </div>
                        <Link href={`${transformedCategory}/${item.slug}`} className={styles.resultLink}>
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
        </div>
      </div>
    </>
  );
};

export default SearchResult;
