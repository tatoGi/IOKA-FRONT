import Hombanner from '@/components/HomeBanner/Hombanner';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NAVIGATION_MENU } from '@/routes/apiRoutes';

const List = () => {
  const [navigationData, setNavigationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNavigationData = async () => {
      try {
        const response = await axios.get(NAVIGATION_MENU);
        if (response.data && response.data.pages) {
          setNavigationData(response.data.pages);
        }
      } catch (err) {
        console.error('Error fetching navigation data:', err);
        setError('Failed to load navigation data');
      } finally {
        setLoading(false);
      }
    };

    fetchNavigationData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Hombanner navigationData={navigationData} />
  );
};

export default List;