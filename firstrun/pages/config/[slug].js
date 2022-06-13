import Layout from "../../components/layout";
import Sidebar from "../../components/sidebar";
import React from 'react';
import { Theme } from "@rjsf/bootstrap-4";
import { withTheme, utils } from "@rjsf/core";

const registry = utils.getDefaultRegistry();
const defaultFileWidget = registry.widgets["FileWidget"];
Theme.widgets["FileWidget"] = defaultFileWidget;
const Form = withTheme(Theme);

function Page({schema, values, slug}) {
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
      let url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/v1/items`;
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
    <div>
      <Form schema={schema}
        formData={values}
        onSubmit={onSubmit} />
    </div>
  )
}

Page.getLayout = function getLayout(page) {
  return (
    <Layout>
      <Sidebar />
      <div className="d-flex flex-column p-3" style={{width: "100%"}}>
        {page}
      </div>
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  let schema, values;

  try {
    let url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/v1/group/${ctx.query.slug}`;
    const res = await fetch(url, {
      method: `GET`,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return;
    }

    const data = await res.json();
    schema = JSON.parse(data.schema);
    values = data.values;
  } catch (err) {
    console.error(err);
  }

  return {
    props: {
      schema,
      values,
      slug: ctx.query.slug,
    },
  };
}

export default Page;
