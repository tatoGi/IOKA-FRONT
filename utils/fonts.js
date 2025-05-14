import { Montserrat } from 'next/font/google';

// Configure Montserrat with specific weights and subsets
export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  variable: '--font-montserrat',
}); 