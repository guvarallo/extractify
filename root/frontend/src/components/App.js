import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import jwt_decode from "jwt-decode";

import { AuthProvider } from "../contexts/AuthContext";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "./Dashboard";
import Signup from "./Signup";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";

let authed;
const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwt_decode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    window.location.href = "/login";
    authed = false;
  } else {
    authed = true;
  }
}

function App() {
  return (
    <Container
      className='d-flex align-items-center justify-content-center'
      style={{ minHeight: "100vh" }}
    >
      <div className='w-100'>
        <Router>
          <AuthProvider>
            <Switch>
              <PrivateRoute
                authed={authed}
                exact
                path='/'
                component={Dashboard}
              />
              <Route path='/signup' component={Signup} />
              <Route path='/login' component={Login} />
              <Route path='/forgot-password' component={ForgotPassword} />
            </Switch>
          </AuthProvider>
        </Router>
      </div>
    </Container>
  );
}

export default App;
