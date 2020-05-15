import React, { useEffect, useState } from "react";
import styles from "./SignUp.module.css";
import { useHistory } from "react-router-dom";

export default function SignUp() {
  const history = useHistory();
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(null);

  function createUser() {
    setError(null);
    fetch("http://localhost:8080/api/users/", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
        confirm_password: confirmPassword
      })
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
        err.json().then(body => {
          console.log(body);
          setError(body.message);
        });
      });
  }

  // useEffect(() => {
  //   requestLogin();
  // }, []);
  return (
    <div>
      <h1>Signup</h1>
      <form action="" className={styles.login}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="text"
          name="email"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />
        <input
          type="password"
          name="confirm_password"
          placeholder="Password"
          onChange={e => setConfirmPassword(e.target.value)}
        />
        <button type="button" onClick={createUser}>
          Sign up
        </button>
        {error ? <p>{error}</p> : null}
      </form>
    </div>
  );
}
