// components/Breadcrumb.js
import Link from 'next/link';

const Breadcrumb = ({ breadcrumbData }) => {
  return (
    <div className="breadcrumb-section">
      <div className="container">
        <ul className="breadcrumb-list">
          {breadcrumbData.map((breadcrumb, index) => (
            <li key={index}>
              <Link href={breadcrumb.path}>{breadcrumb.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Breadcrumb;