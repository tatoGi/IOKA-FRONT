import React from "react";
import Link from "next/link";

const Layout = ({ children }) => {
  return (
    <>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/contact">Contact</Link>
        {/* other navigation links */}
      </nav>
      <main>{children}</main>
    </>
  );
};

export default Layout;
