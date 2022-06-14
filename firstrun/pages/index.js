import Layout from "../components/layout";
import Sidebar from "../components/sidebar";

import { isAuthed } from "../lib/auth";
import { loadSchema } from "../lib/schema/schema";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import router, { useRouter } from 'next/router'
import cookies from 'next-cookies';

export default function Page({groups, appName}) {
  return (
    <>
      <Sidebar groups={groups} appName={appName} />
      Select a group on the left to get started.
    </>
  );
}

Page.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  );
}


export async function getServerSideProps(ctx) {
  const c = cookies(ctx);
  const authed = await isAuthed(c.auth);
  if (!authed) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props:{},
    };
  }

  const schema = await loadSchema();


    // groups = data.groups;
    // appName = data.appName;

  return {
    props: {
        appName: "test",
        groups: schema.groups,
    },
  };
}
