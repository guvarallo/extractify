import React from "react";
import { Route, Redirect } from "react-router-dom";

function PrivateRoute({ component: Component, authed, ...rest }) {
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
