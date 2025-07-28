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
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchMetadata = async () => {
      try {
        setLoading(true);
        // Get the URL for the metadata API
        const url = getMetadataUrl(type, slug);
        console.log('Fetching metadata from:', url);
        
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        // If 404 or other error, return default metadata
        if (!response.ok) {
          if (response.status === 404) {
            console.warn(`Metadata not found for type: ${type}, slug: ${slug}`);
            return setMetadata({
              title: '',
              description: '',
              keywords: '',
              og: {},
              twitter: {}
            });
          }
          throw new Error(`Failed to fetch metadata: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
          setMetadata(data.data);
        } else {
          console.warn(`No metadata found for type: ${type}, slug: ${slug}`);
          // Return default metadata structure
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
