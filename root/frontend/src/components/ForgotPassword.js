import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

function ForgotPassword() {
  const emailRef = useRef();
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setMessage("");
      setLoading(true);
      setError("");
      await resetPassword(emailRef.current.value);
      setMessage("Check your inbox for instructions");
    } catch {
      setError("Failed to reset password");
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: "50%", margin: "auto" }}>
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Reset Password</h2>
          {error && <Alert variant='danger'>{error}</Alert>}
          {message && <Alert variant='success'>{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id='email'>
              <Form.Label>Email</Form.Label>
              <Form.Control type='email' ref={emailRef} required />
            </Form.Group>
            <Button disabled={loading} className='w-100' type='submit'>
              Reset Password
            </Button>
          </Form>
          <div className='w-100 text-center mt-3'>
            <Link to='/login'>Back to login</Link>
          </div>
        </Card.Body>
      </Card>
      <div className='w-100 text-center mt-2'>
        Do not have an account? <Link to='/signup'>Sign Up here!</Link>
      </div>
    </div>
  );
}

export default ForgotPassword;
