// components/Breadcrumb.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { generateBreadcrumbData, getCategoryTitle } from '@/utils/breadcrumbUtils';
import { useState, useEffect } from 'react';

const Breadcrumb = ({ breadcrumbData, customTitle }) => {
  const router = useRouter();
  const path = router.asPath;
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // If no breadcrumbData is provided, generate it from the current path
  const finalBreadcrumbData = breadcrumbData || generateBreadcrumbData(path, customTitle);

  // Truncate long breadcrumb items on mobile
  const truncateText = (text) => {
    if (isMobile && text.length > 15) {
      return text.substring(0, 12) + '...';
    }
    return text;
  };

  return (
    <div className="breadcrumb-section">
      <div className="container">
        <ul className="breadcrumb-list">
          {finalBreadcrumbData.map((breadcrumb, index) => (
            <li key={index}>
              {index === finalBreadcrumbData.length - 1 ? (
                <span title={breadcrumb.title}>{truncateText(breadcrumb.title)}</span>
              ) : (
                <Link href={breadcrumb.path} title={breadcrumb.title}>
                  {truncateText(breadcrumb.title)}
                </Link>
              )}
              {index < finalBreadcrumbData.length - 1 && (
                <span className="breadcrumb-separator"> &gt; </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Breadcrumb;