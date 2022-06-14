import Layout from "../components/layout";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

function Component({groups, appName}) {

  const items = groups.map((group) => {
    return (
      <li key={group.index}>
        <Link passHref href={`/group/${group.href}`}><a className="nav-link text-white">{group.title}</a></Link>
      </li>
    );
  });

  return (
    <>
      <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{width: "280px"}}>
        <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
          <span className="fs-4">{appName}</span>
        </a>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          {items}
        </ul>
        <hr />
      </div>
    </>
  )
}

export default Component;
