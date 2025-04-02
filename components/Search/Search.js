import React from "react";
import './search.module.css';

const decodeImageUrl = (url) => {
  return decodeURIComponent(url);
};

const SearchResult = ({ results = {}, query }) => {
  console.log("Search Results in Component:", results); // Log results
  console.log("Search Query in Component:", query); // Log query

  const totalResults = Object.values(results).flat().length;

  return (
    <div className="container">
      <div className="search-header">
        <h1>Search Results for "{query}"</h1>
        <p>{totalResults} Results</p>
      </div>
      {totalResults === 0 ? (
        <p>No results found for your search.</p>
      ) : (
        Object.keys(results).map((category) => {
          const items = results[category];
          if (!items || items.length === 0) return null;

          return (
            <div key={category} className="search-category">
              <div className="category-header">
                <h2>
                  {category} ({items.length})
                </h2>
                <a href={`/${category}`}>See All</a>
              </div>
              <div className="results-grid">
                {items.map((item) => {
                  if (!item) return null;
                  return (
                    <div key={item.id} className="result-card">
                      <a href={`/${category}/${item.slug}`}>
                        <img
                          src={
                            item.image
                              ? `${
                                  process.env.NEXT_PUBLIC_API_URL
                                }/storage/${decodeImageUrl(item.image)}`
                              : defaultImage
                          }
                          alt={item.image_alt || item.title || "Image"}
                          className="result-image"
                        />
                      </a>
                      <div className="result-details">
                        <h3>{item.title || "Untitled"}</h3>
                        <p>{item.subtitle || "No subtitle available"}</p>
                        <p>{item.date || "No date available"}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default SearchResult;
