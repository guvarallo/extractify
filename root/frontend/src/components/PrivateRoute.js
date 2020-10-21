import React from "react";
import { Route, Redirect } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";

function PrivateRoute({ component: Component, ...rest }) {
  let authed;
  let token = localStorage.FBIdToken;
  if (token) {
    const decodedToken = jwt_decode(token);
    // If token is expired, delete from localStorage and redirect to /login
    if (decodedToken.exp * 1000 < Date.now()) {
      authed = false;
      localStorage.removeItem("FBIdToken");
      delete axios.defaults.headers.common["Authorization"];
    } else {
      authed = true;
    }
  } else {
    authed = false;
  }

  console.log(authed);

  return (
    <Route
      {...rest}
      render={props => {
        return authed ? <Component {...props} /> : <Redirect to='login' />;
      }}
    ></Route>
  );
}

export default PrivateRoute;
