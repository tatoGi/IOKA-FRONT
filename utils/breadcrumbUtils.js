// Utility functions for generating breadcrumb data
export const generateBreadcrumbData = (path, title, type = null) => {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbData = [{ title: 'Home', path: '/' }];

  // Build breadcrumb segments based on path
  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // For the last segment, use the provided title
    if (index === segments.length - 1) {
      breadcrumbData.push({
        title: title || segment.charAt(0).toUpperCase() + segment.slice(1),
        path: currentPath
      });
    } else {
      // For intermediate segments, capitalize the first letter
      breadcrumbData.push({
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        path: currentPath
      });
    }
  });

  return breadcrumbData;
};

// Helper function to get category title from slug
export const getCategoryTitle = (category) => {
  const titles = {
    blogs: 'Blog Posts',
    pages: 'Pages',
    developers: 'Developers',
    offplans: 'Offplan Properties',
    rental_resales: 'Rental & Resale Properties'
  };
  return titles[category] || category.charAt(0).toUpperCase() + category.slice(1);
}; 