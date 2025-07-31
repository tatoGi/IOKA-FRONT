# Meta Component Usage Examples

The Meta component now supports dynamic metadata fetching for all page types. Here are the different ways to use it:

## 1. Dynamic Metadata Fetching (Recommended)

Use this when you want to fetch metadata from your API based on slug and type:

```jsx
import Meta from '../Meta/Meta';

// For any page type - fetches metadata from API
<Meta slug="property-slug" type="offplan" />
<Meta slug="blog-post-slug" type="blog" />
<Meta slug="rental-property-slug" type="rental" />
<Meta slug="resale-property-slug" type="resale" />
<Meta slug="home" type="page" />
```

## 2. Direct Data Passing (Current Implementation)

Use this when you already have the data and want to pass it directly:

### Blog Data
```jsx
// BlogShow component
<Meta data={blogData} type="blog" />

// Where blogData structure is:
// {
//   blog: {
//     title: "Blog Title",
//     subtitle: "Blog Subtitle", 
//     body: "Blog content...",
//     banner_image: "path/to/image.jpg",
//     metadata: {
//       meta_title: "Custom SEO Title",
//       meta_description: "Custom SEO Description",
//       meta_keywords: "keyword1, keyword2",
//       og_title: "Custom OG Title",
//       og_description: "Custom OG Description", 
//       og_image: "path/to/og-image.jpg",
//       twitter_title: "Custom Twitter Title",
//       twitter_description: "Custom Twitter Description",
//       twitter_image: "path/to/twitter-image.jpg",
//       twitter_card: "summary_large_image"
//     },
//     created_at: "2025-01-01T00:00:00Z",
//     updated_at: "2025-01-01T00:00:00Z",
//     tags: ["#tag1", "#tag2"]
//   }
// }
```

### Offplan Data
```jsx
// OffplanShow component
<Meta data={offplanData} type="offplan" />

// Where offplanData structure is:
// {
//   offplan: {
//     title: "Property Title",
//     description: "Property Description",
//     main_image: "path/to/image.jpg",
//     metadata: {
//       meta_title: "Custom SEO Title",
//       meta_description: "Custom SEO Description",
//       // ... other metadata fields
//     }
//   }
// }
```

### Rental/Resale Data
```jsx
// RentalResaleShow component
<Meta data={{ rental: RENTAL_RESALE_DATA }} type="rental" />
// or
<Meta data={{ resale: RENTAL_RESALE_DATA }} type="resale" />

// Where RENTAL_RESALE_DATA structure is:
// {
//   title: "Property Title",
//   description: "Property Description", 
//   image: "path/to/image.jpg",
//   metadata: {
//     meta_title: "Custom SEO Title",
//     meta_description: "Custom SEO Description",
//     // ... other metadata fields
//   }
// }
```

## 3. Clean API Usage

The Meta component now has a clean, simple API with only essential props:

```jsx
// Dynamic API fetching
<Meta slug="property-slug" type="offplan" />

// Direct data passing
<Meta data={responseData} type="blog" />

// Legacy blog support
<Meta blogData={blogData} />
```

## API Endpoint Structure

The metadata API should be structured as:
- `GET /api/metadata/blog/blog-slug`
- `GET /api/metadata/offplan/property-slug`  
- `GET /api/metadata/rental/property-slug`
- `GET /api/metadata/resale/property-slug`
- `GET /api/metadata/page/page-slug`

## Metadata Fields Supported

All metadata objects should include:
- `meta_title` - Page title
- `meta_description` - Page description  
- `meta_keywords` - SEO keywords
- `og_title` - Open Graph title
- `og_description` - Open Graph description
- `og_image` - Open Graph image
- `twitter_title` - Twitter card title
- `twitter_description` - Twitter card description
- `twitter_image` - Twitter card image
- `twitter_card` - Twitter card type

## Smart Fallback System

The Meta component automatically falls back to:
1. Custom metadata fields (if provided)
2. Content title/description (from main data)
3. Prop values (if provided)
4. Default IOKA values

## SEO Features Generated

- Basic meta tags (title, description, keywords)
- Open Graph tags for social media sharing
- Twitter Card meta tags  
- Article-specific metadata for blogs
- JSON-LD structured data for rich snippets
- Canonical URLs
- Proper content type detection (article vs website)
