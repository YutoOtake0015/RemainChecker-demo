// React & Next.js
import React from "react";
import Head from "next/head";

const PageHead = ({ children }) => {
  return (
    <>
      <Head>{children}</Head>
    </>
  );
};

export default PageHead;
