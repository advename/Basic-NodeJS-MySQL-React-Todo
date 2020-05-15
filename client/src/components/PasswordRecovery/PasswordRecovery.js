import React, { useEffect, useState } from "react";
import styles from "./PasswordRecovery.module.css";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router";
import queryString from "query-string";

export default function PasswordRecovery({ requestToken }) {
  const history = useHistory();
  const location = useLocation();

  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  function sendRecoveryEmail() {
    setError(null);
    const data = {
      email
    };
    fetch("http://localhost:8080/api/users/recovery/request/", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        console.log(res);
        if (res.ok) {
          // fetch provides an ok flag indicating wether the HTTP status code is in the successful range or not
          setEmailSent(true);
        } else {
          throw res;
        }
      })
      .catch(err => {
        console.log(err);
        err.json().then(body => {
          console.log(body);
          setError(body.message);
        });
      });
  }

  function createNewPasswords() {
    setError(null);
    const data = {
      token: token,
      password: password,
      confirm_password: confirmPassword,
      id: userId
    };
    console.log(data);
    fetch("http://localhost:8080/api/users/recovery/", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        console.log(res);
        if (res.ok) {
          // fetch provides an ok flag indicating wether the HTTP status code is in the successful range or not
          history.push("/login");
        } else {
          throw res;
        }
      })
      .catch(err => {
        console.log(err);
        err.json().then(body => {
          console.log(body);
          setError(body.message);
        });
      });
  }

  function renderContent() {
    if (!token) {
      if (!emailSent) {
        return (
          <React.Fragment>
            <h1>Recover your password</h1>
            <form action="" className={styles.pRecovery}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={e => setEmail(e.target.value)}
              />
              <button type="button" onClick={sendRecoveryEmail}>
                Send email
              </button>
              {error ? <p>{error}</p> : null}
            </form>
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment>
            <h1>Recover your password</h1>
            <h3>Email sent - check your inbox!</h3>
          </React.Fragment>
        );
      }
    } else {
      return (
        <React.Fragment>
          <h1>Create a new password</h1>
          <form action="" className={styles.pRecovery}>
            <input
              type="password"
              name="password"
              placeholder="New Password"
              onChange={e => setPassword(e.target.value)}
            />
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              onChange={e => setConfirmPassword(e.target.value)}
            />
            <button type="button" onClick={createNewPasswords}>
              Update passwords
            </button>
            {error ? <p>{error}</p> : null}
          </form>
        </React.Fragment>
      );
    }
  }

  useEffect(() => {
    const params = queryString.parse(location.search);
    setToken(params.token);
    setUserId(params.id);
  }, []);

  return <div>{renderContent()}</div>;
}
