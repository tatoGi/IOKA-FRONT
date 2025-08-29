import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getMetadataUrl } from '@/routes/apiRoutes';

/**
 * Fetches metadata for a specific page or content type
 * @param {string} slug - The slug of the page/content
 * @param {string} type - The type of content (e.g., 'page', 'blog', 'offplan', 'rental')
 * @returns {Object} - Contains metadata, loading state, and error if any
 */
const usePageMetadata = (slug, type = 'Page') => {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Skip if no slug or invalid type
    if (!slug || !type) {
      setLoading(false);
      return;
    }
    
    // Normalize type to handle cases where type might be 'page/offplan'
    let normalizedType = type.toLowerCase();
    
    // Handle cases where type might be 'page/offplan' or similar
    if (normalizedType.includes('/')) {
      normalizedType = normalizedType.split('/').pop(); // Take the last part
    }
    
    // Special handling for page type
    if (normalizedType === 'page') {
      normalizedType = slug.startsWith('blog/') ? 'blog' : 'page';
    }

    const fetchMetadata = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use normalized type for the API request
        const url = getMetadataUrl(normalizedType, slug);
        console.log('Fetching metadata for:', { type, normalizedType, slug, url });
        
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            console.warn(`Metadata not found for type: ${type}, slug: ${slug}`);
            const typeName = type === 'offplan' ? 'Property' : type.charAt(0).toUpperCase() + type.slice(1);
            
            const defaultMetadata = {
              title: `${typeName} Not Found | IOKA Real Estate`,
              description: `The requested ${typeName.toLowerCase()} could not be found.`,
              keywords: '',
              og: {
                title: `${typeName} Not Found | IOKA Real Estate`,
                description: `The requested ${typeName.toLowerCase()} could not be found.`,
                image: '/assets/img/logo.png'
              },
              twitter: {
                card: 'summary',
                title: `${typeName} Not Found | IOKA Real Estate`,
                description: `The requested ${typeName.toLowerCase()} could not be found.`,
                image: '/assets/img/logo.png'
              }
            };
            
            setMetadata(defaultMetadata);
            setError(`The requested ${typeName.toLowerCase()} could not be found.`);
            return;
          }
          throw new Error(`Failed to fetch metadata: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
          // Ensure the metadata has all required fields with fallbacks
          const formattedData = {
            title: data.data.title || data.data.meta_title || '',
            description: data.data.description || data.data.meta_description || '',
            keywords: data.data.keywords || data.data.meta_keywords || '',
            og: {
              title: data.data.og?.title || data.data.meta_title || data.data.title || '',
              description: data.data.og?.description || data.data.meta_description || data.data.description || '',
              image: data.data.og?.image || data.data.image || data.data.featured_image || '/assets/img/logo.png',
              url: data.data.og?.url || window.location.href
            },
            twitter: {
              card: data.data.twitter?.card || 'summary_large_image',
              title: data.data.twitter?.title || data.data.meta_title || data.data.title || '',
              description: data.data.twitter?.description || data.data.meta_description || data.data.description || '',
              image: data.data.twitter?.image || data.data.image || data.data.featured_image || '/assets/img/logo.png'
            }
          };
          
          setMetadata(formattedData);
        } else {
          console.warn(`No valid metadata found in response for type: ${type}, slug: ${slug}`, data);
          // Set fallback metadata
          const typeName = type === 'offplan' ? 'Property' : type.charAt(0).toUpperCase() + type.slice(1);
          setMetadata({
            title: '',
            description: '',
            keywords: '',
            og: {},
            twitter: {}
          });
        }
      } catch (err) {
        console.error('Error fetching metadata:', err);
        setError(err.message);
        
        // Set fallback metadata on error
        const typeName = type === 'offplan' ? 'Property' : type.charAt(0).toUpperCase() + type.slice(1);
        setMetadata({
          title: `Error Loading ${typeName} | IOKA Real Estate`,
          description: 'There was an error loading this page. Please try again later.',
          keywords: '',
          og: {
            title: `Error Loading ${typeName} | IOKA Real Estate`,
            description: 'There was an error loading this page. Please try again later.',
            image: '/assets/img/logo.png'
          },
          twitter: {
            card: 'summary',
            title: `Error Loading ${typeName} | IOKA Real Estate`,
            description: 'There was an error loading this page. Please try again later.',
            image: '/assets/img/logo.png'
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [slug, type]);

  // Format the metadata into a consistent structure
  const formatMetadata = () => {
    if (!metadata) return null;

    return {
      meta: {
        title: metadata.meta_title || metadata.title || 'IOKA Real Estate',
        description: metadata.meta_description || metadata.description?.substring(0, 160) || 'Discover premium real estate properties with IOKA',
        keywords: metadata.meta_keywords || '',
        og: {
          title: metadata.og_title || metadata.meta_title || metadata.title || 'IOKA Real Estate',
          description: metadata.og_description || metadata.meta_description || metadata.description?.substring(0, 160) || 'Discover premium real estate properties with IOKA',
          image: metadata.og_image || metadata.image
        },
        twitter: {
          card: metadata.twitter_card || 'summary_large_image',
          title: metadata.twitter_title || metadata.meta_title || metadata.title || 'IOKA Real Estate',
          description: metadata.twitter_description || metadata.meta_description || metadata.description?.substring(0, 160) || 'Discover premium real estate properties with IOKA',
          image: metadata.twitter_image || metadata.og_image || metadata.image
        }
      }
    };
  };

  return {
    ...formatMetadata(),
    loading,
    error
  };
};

export default usePageMetadata;
