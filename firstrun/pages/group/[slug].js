import Layout from "../../components/layout";
import Sidebar from "../../components/sidebar";
import React from 'react';
import { Theme } from "@rjsf/bootstrap-4";
import { withTheme, utils } from "@rjsf/core";
import cookies from 'next-cookies';
import { isAuthed } from "../../lib/auth";
import { loadSchema, loadValues } from "../../lib/schema/schema";

const registry = utils.getDefaultRegistry();
const defaultFileWidget = registry.widgets["FileWidget"];
Theme.widgets["FileWidget"] = defaultFileWidget;
const Form = withTheme(Theme);

function Page({groups, appName, schema, values, slug}) {
  const onSubmit = async (data) => {
    const items = [];
    for (const [key, value] of Object.entries(data.formData)) {
      const itemValue = {
        groupHref: slug,
        itemName: key,
        value,
      };
      items.push(itemValue);
    }

    try {
      let url = `/config/api/items`;
      const res = await fetch(url, {
        method: `PUT`,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
        }),
      });

      if (!res.ok) {
        return;
      }

    } catch (err) {
      console.error(err);
    }
  };

  // react json schema form doens't work with server side rendering
  if (!global.window) {
    return <div><form /></div>;
  }

  return (
    <>
      <Sidebar appName={appName} groups={groups} />
      <div className="d-flex flex-column p-3" style={{width: "100%"}}>
        <Form schema={schema}
          formData={values}
          onSubmit={onSubmit} />
      </div>
    </>
  )
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
  const group = schema.groups.find((group) => {
    return ctx.query.slug === group.href;
  });

  const values = await loadValues(group.href);

  return {
    props: {
      schema: group,
      values,
      slug: ctx.query.slug,
      groups: schema.groups,
      appName: "Application Config",
    },
  };
}

export default Page;
