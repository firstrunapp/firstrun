import * as React from "react";
import { useRouter } from 'next/router'

export default function Navbar() {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push("/");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-default">
      <a className="navbar-brand" href="#" onClick={handleLogoClick}>
        <span style={{paddingLeft: "10px"}}>FirstRun</span>
      </a>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav" style={{paddingLeft: "30px"}}>
          <li className="nav-item">
          </li>
        </ul>
      </div>
    </nav>
  );
}
