import React, { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Form, Button, Card, Alert, Spinner } from "react-bootstrap";

import { useAuth } from "../contexts/AuthContext";

function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    const userData = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      setError("");
      await login(userData, history);
      history.push("/");
    } catch {
      setError("Wrong credentials");
      setLoading(false);
    }
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Login</h2>
          {error && <Alert variant='danger'>{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id='email'>
              <Form.Label>Email</Form.Label>
              <Form.Control type='email' ref={emailRef} required />
            </Form.Group>
            <Form.Group id='password'>
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' ref={passwordRef} required />
            </Form.Group>
            <Button disabled={loading} className='w-100' type='submit'>
              {loading && (
                <Spinner
                  as='span'
                  animation='border'
                  size='sm'
                  role='status'
                  aria-hidden='true'
                  style={{ marginRight: "10px" }}
                />
              )}
              Login
            </Button>
          </Form>
          <div className='w-100 text-center mt-3'>
            <Link to='/forgot-password'>Forgot Password?</Link>
          </div>
        </Card.Body>
      </Card>
      <div className='w-100 text-center mt-2'>
        Do not have an account? <Link to='/signup'>Sign Up here!</Link>
      </div>
    </>
  );
}

export default Login;
