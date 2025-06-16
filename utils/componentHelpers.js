// Utility functions for consistent component loading

/**
 * Check if data is available for a component
 * @param {any} data - The data to check
 * @returns {boolean} - True if data is available
 */
export const hasData = (data) => {
  if (data === null || data === undefined) return false;
  if (Array.isArray(data)) return data.length > 0;
  if (typeof data === 'object') return Object.keys(data).length > 0;
  return true;
};

/**
 * Get a default loading component
 * @param {string} componentName - Name of the component
 * @param {string} height - Height of the loading component
 * @returns {JSX.Element} - Loading component
 */
export const getLoadingComponent = (componentName, height = '200px') => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: height,
      flexDirection: 'column',
      gap: '10px',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      margin: '10px 0'
    }}>
      <div style={{
        width: '30px',
        height: '30px',
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #049878',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{ 
        color: '#666', 
        fontSize: '14px', 
        margin: 0,
        textAlign: 'center'
      }}>
        Loading {componentName}...
      </p>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

/**
 * Get an error component
 * @param {string} error - Error message
 * @param {Function} onRetry - Retry function
 * @returns {JSX.Element} - Error component
 */
export const getErrorComponent = (error, onRetry) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
      flexDirection: 'column',
      gap: '15px',
      padding: '20px',
      backgroundColor: '#fff5f5',
      borderRadius: '8px',
      margin: '10px 0',
      border: '1px solid #fed7d7'
    }}>
      <p style={{ 
        color: '#c53030', 
        fontSize: '14px', 
        margin: 0,
        textAlign: 'center'
      }}>
        Error: {error}
      </p>
      {onRetry && (
        <button 
          onClick={onRetry}
          style={{
            padding: '8px 16px',
            backgroundColor: '#049878',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Try Again
        </button>
      )}
    </div>
  );
};

/**
 * Process sections data consistently
 * @param {Array} sections - Array of sections data
 * @returns {Object} - Processed sections map
 */
export const processSectionsData = (sections) => {
  if (!sections || !Array.isArray(sections)) {
    console.warn("Invalid sections data:", sections);
    return {};
  }

  const sectionMap = {};
  const sectionKeys = [
    'section_one', 'section_two', 'section_three', 
    'section_four', 'section_five', 'section_six', 'section_seven'
  ];

  sectionKeys.forEach(key => {
    sectionMap[key] = sections.find(section => section.section_key === key) || null;
  });

  return sectionMap;
};

/**
 * Create a consistent component wrapper
 * @param {Object} props - Component props
 * @param {any} data - Data for the component
 * @param {string} componentName - Name of the component
 * @param {Function} Component - The component to render
 * @param {Function} onRetry - Retry function for errors
 * @returns {JSX.Element} - Wrapped component
 */
export const withConsistentLoading = (props, data, componentName, Component, onRetry) => {
  if (!hasData(data)) {
    return getLoadingComponent(componentName);
  }

  try {
    return <Component {...props} />;
  } catch (error) {
    console.error(`Error rendering ${componentName}:`, error);
    return getErrorComponent(error.message, onRetry);
  }
}; 