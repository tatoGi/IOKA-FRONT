# Consistent Component Loading Strategy

## Overview
This strategy ensures all components load consistently by implementing proper state management, error handling, and loading states.

## Key Principles

### 1. **Consistent State Management**
- All components follow the same loading pattern
- Data is processed consistently across components
- Error states are handled uniformly

### 2. **Progressive Enhancement**
- Components render immediately with loading states
- Data populates as it becomes available
- Users see page structure instantly

### 3. **Error Resilience**
- Components handle errors gracefully
- Retry mechanisms are available
- Fallback content is provided

## Implementation

### Main Component (Hombanner.js)

```javascript
import React, { useState, useEffect } from "react";
import { processSectionsData } from "../../utils/componentHelpers";

const Hombanner = ({ initialData, navigationData }) => {
  // Initialize state with initial data if available
  const [cardData, setCardData] = useState(initialData || []);
  const [sectionData, setSectionData] = useState({});
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(!initialData || initialData.length === 0);
  const [error, setError] = useState(null);
  const [dataProcessed, setDataProcessed] = useState(false);

  useEffect(() => {
    // Process initial data immediately if available
    if (initialData && initialData.length > 0) {
      setCardData(initialData);
      setSectionData(processSectionsData(initialData));
      setIsLoading(false);
      setDataProcessed(true);
      return;
    }

    // Fetch data from API if no initial data
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(SECTION_API);
        if (response.data && response.data.sections) {
          setCardData(response.data.sections);
          setSectionData(processSectionsData(response.data.sections));
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
        setDataProcessed(true);
      }
    };

    fetchData();
  }, [initialData]);

  // Show loading state only if we have no data and are still loading
  if (isLoading && !dataProcessed) {
    return <LoadingSpinner />;
  }

  // Show error state if data fetching failed
  if (error && !dataProcessed) {
    return <ErrorMessage error={error} onRetry={() => window.location.reload()} />;
  }

  // Always render all components
  return (
    <>
      <div className="home-banner">
        <HomeBannerSwiper sectionData={sectionData.section_one} />
        <HomeBannerSearch />
      </div>
      <LiveInvestSection sectionDataTwo={sectionData.section_two} />
      <NewProperties sectionDataThree={sectionData.section_three} />
      <PopularAreaSection sectionDataFour={sectionData.section_four} />
      <TeamSection sectionDataFive={sectionData.section_five} />
      <Clients sectionSixData={sectionData.section_six} />
      <NewsSection sectionSevenData={sectionData.section_seven} />
      <PartnersSection />
    </>
  );
};
```

### Individual Component Example

```javascript
// components/LiveInvestSection/LiveInvestSection.js
import React from "react";
import { withConsistentLoading, hasData } from "../../utils/componentHelpers";

const LiveInvestSection = ({ sectionDataTwo, navigationData }) => {
  // Component logic here
  const renderContent = () => {
    if (!hasData(sectionDataTwo)) {
      return <p>No live investment data available</p>;
    }

    return (
      <div className="live-invest-section">
        {/* Your component content */}
        <h2>{sectionDataTwo.title}</h2>
        <p>{sectionDataTwo.description}</p>
        {/* More content */}
      </div>
    );
  };

  return (
    <div className="live-invest-container">
      {withConsistentLoading(
        { sectionDataTwo, navigationData },
        sectionDataTwo,
        "Live Invest Section",
        renderContent,
        () => window.location.reload()
      )}
    </div>
  );
};

export default LiveInvestSection;
```

### Utility Functions

```javascript
// utils/componentHelpers.js

// Check if data is available
export const hasData = (data) => {
  if (data === null || data === undefined) return false;
  if (Array.isArray(data)) return data.length > 0;
  if (typeof data === 'object') return Object.keys(data).length > 0;
  return true;
};

// Process sections data consistently
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

// Consistent loading wrapper
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
```

## Benefits

### ✅ **Consistent Behavior**
- All components follow the same loading pattern
- Predictable user experience
- Uniform error handling

### ✅ **Better Performance**
- Components render immediately
- Data loads progressively
- No blocking on individual sections

### ✅ **Improved Reliability**
- Graceful error handling
- Retry mechanisms
- Fallback content

### ✅ **Maintainable Code**
- Reusable utility functions
- Consistent patterns
- Easy to debug

## Best Practices

### 1. **Always Check Data Availability**
```javascript
if (!hasData(sectionData)) {
  return <LoadingComponent />;
}
```

### 2. **Handle Errors Gracefully**
```javascript
try {
  // Component logic
} catch (error) {
  console.error("Component error:", error);
  return <ErrorComponent error={error} />;
}
```

### 3. **Provide Meaningful Loading States**
```javascript
<LoadingComponent 
  componentName="Property Listings" 
  height="400px" 
/>
```

### 4. **Use Consistent State Management**
```javascript
const [data, setData] = useState(null);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);
```

## Testing

### Unit Tests
```javascript
describe('Component Loading', () => {
  test('shows loading state when no data', () => {
    const { getByText } = render(<Component data={null} />);
    expect(getByText('Loading...')).toBeInTheDocument();
  });

  test('renders content when data is available', () => {
    const { getByText } = render(<Component data={{ title: 'Test' }} />);
    expect(getByText('Test')).toBeInTheDocument();
  });
});
```

## Conclusion

This consistent loading strategy ensures:
1. **All components load reliably**
2. **Users see content immediately**
3. **Errors are handled gracefully**
4. **Code is maintainable and testable**

By following these patterns, your application will provide a consistent and reliable user experience across all components. 