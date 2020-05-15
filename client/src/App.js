import React, { useState, useEffect } from "react";
//Import BrowserRoute to enclose the components and Route for path declaration
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Todo from "./components/Todo/Todo";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import PasswordRecovery from "./components/PasswordRecovery/PasswordRecovery";

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [authenticating, setAuthenticating] = useState(true);

  function initialIsAuthenticated() {
    fetch("http://localhost:8080/api/users/is-authenticated/", {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }).then(res => {
      setAuthenticating(false);
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
          <Switch>
            {/* <Redirect to="/" /> */}
            {/* <Route exact path="/" component={Todo} /> */}
            <PrivateRoute exact path="/" component={Todo} isAuth={isAuth} />

            <Route
              path="/login"
              render={props => <Login {...props} setIsAuth={setIsAuth} />}
            />
            <Route path="/signup" component={SignUp} />
            <Route path="/password-recovery" component={PasswordRecovery} />
          </Switch>
        </main>
        )}
      </div>
    </BrowserRouter>
  );
}

const PrivateRoute = ({ component: Component, isAuth }) => {
  return (
    <Route
      render={props =>
        isAuth ? <Component {...props} /> : <Component {...props} />
      }
    />
  );
};

// const PrivateRoute = ( component, ...options ) => {
//   console.log("AYYYOOoo");
//   const { isAuth } = options;
//   if (isAuth) {
//     return <Route {...options} component={component} />;
//   } else {
//     return <Redirect to="/login" />;
//   }
// };
