import Layout from "../components/layout";
import Sidebar from "../components/sidebar";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import router, { useRouter } from 'next/router'

export default function Page() {
  return (
    <div>
      Select a group on the left to get started.
    </div>
  );
}

Page.getLayout = function getLayout(page) {
  return (
    <Layout>
      <Sidebar />
      Home page, should not see this.
    </Layout>
  );
}

// This is here to disable https://nextjs.org/docs/advanced-features/automatic-static-optimization
// specifically the router.query isn't loaded without this
Page.getInitialProps = async (ctx) => {
  return {};
}

