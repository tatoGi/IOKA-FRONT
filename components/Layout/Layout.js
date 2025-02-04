import React from "react";
import Link from "next/link";

const Layout = ({ children }) => {
  return (
    <>
      <main>{children}</main>
    </>
  );
};

export default Layout;
