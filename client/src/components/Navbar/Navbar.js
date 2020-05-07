import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar({ isAuth, setIsAuth }) {
  function logout() {
    fetch(`http://localhost:8080/api/users/logout`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      credentials: "include"
    })
      .then(res => {
        if (res.ok) {
          setIsAuth(false);
        }
      })
      .catch(err => {
        console.log("Could not log out");
      });
  }

  return (
    <nav>
      <ul>
        {isAuth ? (
          <React.Fragment>
            <li>
              <NavLink exact to="/">
                Todos
              </NavLink>
            </li>
            <li onClick={logout}>
              <a href="#logout">Logout</a>
            </li>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
            <li>
              <NavLink to="/signup">Signup</NavLink>
            </li>
          </React.Fragment>
        )}
      </ul>
    </nav>
  );
}
