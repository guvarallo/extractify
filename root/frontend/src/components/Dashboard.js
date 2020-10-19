import React, { useState } from "react";
import { Alert, Accordion, Card, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  async function handleLogout() {
    setError("");

    try {
      await logout();
      history.push("/login");
    } catch {
      setError("Failed to logout");
    }
  }

  return (
    <>
      <Card>
        <Card.Body className='text-center'>
          <h2 className='mb-4'>Profile</h2>
          {error && <Alert variant='danger'>{error}</Alert>}
          <strong>Email:</strong> {currentUser.email}
          <div className='w-100 mt-2'>
            <Button variant='link' onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Card.Body>
      </Card>
      <br />
      <Accordion defaultActiveKey='0'>
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant='link' eventKey='0'>
              Click me!
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey='0'>
            <Card.Body>Hello! I'm the body</Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant='link' eventKey='1'>
              Click me!
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey='1'>
            <Card.Body>Hello! I'm another body</Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </>
  );
}

export default Dashboard;
