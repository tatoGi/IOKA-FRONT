const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is not defined');
}

export const BLOGS_API = `${API_BASE_URL}/blogs`;

// Add more routes as needed
