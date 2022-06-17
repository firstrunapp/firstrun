import Layout from "../components/layout";
import { useRouter } from 'next/router'

import React, { useState } from 'react';



export default function Page() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);

  const onChangePassword = async (ev) => {
    setPassword(ev.target.value);
  }

  const onSubmit = async (ev) => {
    ev.preventDefault();

    setShowError(false);

    try {
      let url = `/config/api/login`;
      const res = await fetch(url, {
        method: `POST`,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
        }),
      });

      if (!res.ok) {
        setShowError(true);
        return;
      }

      router.push("/");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div className="card border-0 shadow rounded-3 my-5">
            <div className="card-body p-4 p-sm-5" style={{backgroundColor: "rgb(246, 246, 239)"}}>
              <h2 className="card-title text-center mb-5 fw-light fs-5">Log in to the config page</h2>
              <p>
                Enter the password to log in to the config page
              </p>
              <form>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" className="form-control" placeholder="Password" onChange={onChangePassword} />
                </div>
                <div className={`alert alert-danger my-3 ${!showError ? "d-none" : ""}`} role="alert">
                  Failed to log in
                </div>
                <div className="mb-12 text-center py-4">
                  <button className="btn btn-primary" type="submit" onClick={onSubmit}>
                    Log in
                  </button>
                </div>

                <hr className="my-4" />

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Page.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  );
}

