# Meta Component - Clean & Simple

The Meta component has been cleaned up to have a simple, focused API.

## Props

```jsx
const Meta = ({ 
  // For dynamic API fetching
  slug = '',           // Page slug to fetch metadata for
  type = 'page',       // Content type: 'blog', 'offplan', 'rental', 'resale', 'page'
  
  // For direct data passing (recommended)
  data = null,         // Direct data object with metadata
  
  // Legacy support
  blogData = null      // Legacy blog data support
}) => { ... }
```

## Usage Examples

### 1. Direct Data Passing (Current Implementation)
```jsx
// Blog
<Meta data={blogData} type="blog" />

// Offplan
<Meta data={offplanData} type="offplan" />

// Rental/Resale
<Meta data={{ rental: RENTAL_RESALE_DATA }} type="rental" />
```

### 2. Dynamic API Fetching
```jsx
<Meta slug="property-slug" type="offplan" />
<Meta slug="blog-post-slug" type="blog" />
```

## Data Structure Expected

```jsx
// For any content type
{
  [contentType]: {
    title: "Content Title",
    description: "Content Description",
    banner_image: "path/to/image.jpg", // or image, main_image
    metadata: {
      meta_title: "Custom SEO Title",
      meta_description: "Custom SEO Description",
      meta_keywords: "keyword1, keyword2",
      og_title: "Custom OG Title",
      og_description: "Custom OG Description",
      og_image: "path/to/og-image.jpg",
      twitter_title: "Custom Twitter Title",
      twitter_description: "Custom Twitter Description",
      twitter_image: "path/to/twitter-image.jpg",
      twitter_card: "summary_large_image"
    }
  }
}
```

## Features

✅ **Clean API** - Only 4 props needed  
✅ **Smart Fallbacks** - metadata → content → defaults  
✅ **Multiple Data Sources** - API fetching or direct data  
✅ **Content Type Detection** - Automatic article vs website  
✅ **Image Handling** - Multiple image field support  
✅ **SEO Complete** - All meta tags, Open Graph, Twitter Cards, JSON-LD  

## Default Values

- **Title**: "IOKA Real Estate"
- **Description**: "Discover premium real estate properties with IOKA"
- **Image**: IOKA logo
- **Twitter Card**: "summary_large_image"

The component automatically generates comprehensive SEO metadata with intelligent fallbacks.
