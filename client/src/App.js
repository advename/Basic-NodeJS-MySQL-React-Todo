import React, { useState, useEffect } from "react";
//Import BrowserRoute to enclose the components and Route for path declaration
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Todo from "./components/Todo/Todo";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp.js";

export default function App() {
  const [isAuth, setIsAuth] = useState(false);

  function initialIsAuthenticated() {
    fetch("http://localhost:8080/api/users/is-authenticated/", {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }).then(res => {
      if (res.ok) {
        setIsAuth(true);
      }
    });
  }

  useEffect(() => {
    initialIsAuthenticated();
  }, [isAuth]);

  return (
    <BrowserRouter>
      <div id="app">
        <header>
          <Navbar isAuth={isAuth} setIsAuth={setIsAuth} />
        </header>
        <main>
          {isAuth ? (
            <React.Fragment>
              <Redirect to="/" />
              <Switch>
                <Route exact path="/" component={Todo} />
              </Switch>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Redirect to="/login" />
              <Switch>
                <Route
                  path="/login"
                  render={props => <Login {...props} setIsAuth={setIsAuth} />}
                />
                <Route path="/signup" component={SignUp} />
              </Switch>
            </React.Fragment>
          )}
        </main>
      </div>
    </BrowserRouter>
  );
}
