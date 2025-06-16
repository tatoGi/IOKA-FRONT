import Hombanner from '@/components/HomeBanner/Hombanner';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NAVIGATION_MENU } from '@/routes/apiRoutes';

const List = () => {
  const [navigationData, setNavigationData] = useState([]);

  useEffect(() => {
    const fetchNavigationData = async () => {
      try {
        const response = await axios.get(NAVIGATION_MENU);
        if (response.data && response.data.pages) {
          setNavigationData(response.data.pages);
        }
      } catch (err) {
        console.error('Error fetching navigation data:', err);
      }
    };

    fetchNavigationData();
  }, []);

  // Always render the component - data will populate when available
  return (
    <Hombanner navigationData={navigationData} />
  );
};

export default List;