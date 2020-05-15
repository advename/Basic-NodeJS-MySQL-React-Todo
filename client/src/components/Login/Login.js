import React, { useEffect, useState } from "react";
import styles from "./Login.module.css";
import { useHistory, Redirect } from "react-router-dom";

export default function Login({ setIsAuth }) {
  const history = useHistory();
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [error, setError] = useState(null);

  function makeLogin() {
    fetch("http://localhost:8080/api/users/login/", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    })
      .then(res => {
        if (res.ok) {
          setIsAuth(true);
          history.push("/");
        } else {
          throw res;
        }
      })
      .catch(err => {
        err.json().then(body => {
          console.log(body);
          setError(body.message);
        });
      });
  }

  return (
    <div>
      <h1>Login</h1>
      <form action="" className={styles.login}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />
        <button type="button" onClick={makeLogin}>
          Log in
        </button>
        {error ? <p>{error}</p> : null}
        <p onClick={() => history.push("/password-recovery/")}>
          Forgot password?
        </p>
      </form>
    </div>
  );
}
