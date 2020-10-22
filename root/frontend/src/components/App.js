import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { AuthProvider } from "../contexts/AuthContext";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "./Dashboard";
import Signup from "./Signup";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";

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
              <PrivateRoute exact path='/' component={Dashboard} />
              <div style={{ maxWidth: "50%", margin: "auto" }}>
                <div style={{ textAlign: "center", marginBottom: "50px" }}>
                  <h2 className='mb-4'>Welcome to Extractify</h2>
                  <p>An app that parses PDF to Text in seconds!</p>
                </div>
                <Route path='/signup' component={Signup} />
                <Route path='/login' component={Login} />
                <Route path='/forgot-password' component={ForgotPassword} />
              </div>
            </Switch>
          </AuthProvider>
        </Router>
      </div>
    </Container>
  );
}

export default App;
