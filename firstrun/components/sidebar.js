import Layout from "../components/layout";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Component() {
  // const router = useRouter()

  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [appName, setAppName] = useState("");

  useEffect( async() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      let url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/v1/groups`;
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

      setIsLoading(false);
      setGroups(data.groups);
      setAppName(data.appName);

    } catch (err) {
      console.error(err);
    }
  }

  if (isLoading) {
    return (
      <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{width: "280px"}}>

      </div>
    );
  }

  const items = groups.map((group) => {
    return (
      <li key={group.index}>
        <Link passHref href={`/config/${group.href}`}><a className="nav-link text-white">{group.title}</a></Link>
      </li>
    );
  });

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{width: "280px"}}>
      <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <span className="fs-4">{appName}</span>
      </a>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        {items}
      </ul>
      <hr />
      <Link href="https://firstrun.app">
        Get your own FirstRun.app config
      </Link>
    </div>
  )
}

// This is here to disable https://nextjs.org/docs/advanced-features/automatic-static-optimization
// specifically the router.query isn't loaded without this
Component.getInitialProps = async (ctx) => {
  return {};
}

