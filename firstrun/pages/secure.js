import Layout from "../components/layout";
import { useRouter } from 'next/router'

import React, { useState } from 'react';



export default function Page() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showError, setShowError] = useState(false);

  const onChangePassword = async (ev) => {
    setPassword(ev.target.value);
  }

  const onChangeConfirmPassword = async (ev) => {
    setConfirmPassword(ev.target.value);
  }

  const onSkip = async () => {
    ev.preventDefault();
    window.sessionStorage.setItem("promptedForAuth", "1");
  }

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (password !== confirmPassword) {
      setShowError(true);
      return;
    }

    setShowError(false);

    try {
      let url = `/config/api/auth`;
      const res = await fetch(url, {
        method: `PUT`,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
        }),
      });

      if (!res.ok) {
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
              <h2 className="card-title text-center mb-5 fw-light fs-5">Secure the config page</h2>
              <p>
                Before continuing, please provide a password that will be required to
                view this page again.
              </p>
              <p>
                Without a password, anyone who can access the URL will be able to view
                and set the application config.
              </p>
              <form>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" className="form-control" placeholder="Password" onChange={onChangePassword} />
                </div>
                <div className="form-group my-2">
                  <label>Confirm</label>
                  <input type="password" className="form-control" placeholder="Confirm" onChange={onChangeConfirmPassword} />
                </div>
                <div className={`alert alert-danger my-3 ${!showError ? "d-none" : ""}`} role="alert">
                  Passwords do not match
                </div>
                <div className="mb-12 text-center py-4">
                  <button className="btn btn-primary" type="submit" onClick={onSubmit}>
                    Set Password
                  </button>
                  {' '}
                  <button className="btn btn-outline-secondary" onClick={onSkip}>
                    Skip
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

