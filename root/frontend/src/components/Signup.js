import React, { useRef, useState } from "react";
import { Form, Button, Card, Spinner } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

function Signup() {
  const userRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError({ password: "Passwords do not match" });
    }

    setLoading(true);

    const newUserData = {
      user: userRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      confirmPassword: passwordConfirmRef.current.value,
    };

    try {
      setError("");
      await signup(newUserData, history);
    } catch (err) {
      setError(err.response.data);
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "50%", margin: "auto" }}>
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Sign Up</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group id='user'>
              <Form.Label>Username</Form.Label>
              <Form.Control type='text' ref={userRef} required />
              <Form.Control.Feedback
                type='invalid'
                style={{ display: "block" }}
              >
                {error.user}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group id='email'>
              <Form.Label>Email</Form.Label>
              <Form.Control type='email' ref={emailRef} required />
              <Form.Control.Feedback
                type='invalid'
                style={{ display: "block" }}
              >
                {error.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group id='password'>
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' ref={passwordRef} required />
            </Form.Group>
            <Form.Group id='password-confirm'>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type='password' ref={passwordConfirmRef} required />
              <Form.Control.Feedback
                type='invalid'
                style={{ display: "block" }}
              >
                {error.password}
              </Form.Control.Feedback>
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
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className='w-100 text-center mt-2'>
        Already have an account? <Link to='/login'>Login here!</Link>
      </div>
    </div>
  );
}

export default Signup;
