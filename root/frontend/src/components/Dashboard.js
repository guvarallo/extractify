import React, { useState } from "react";
import { Alert, Card, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import Pdf from "../components/Pdf";

function Dashboard({ token }) {
  const [error, setError] = useState("");
  const { logout } = useAuth();
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
      <Card className='app' style={{ maxWidth: "50%", margin: "auto" }}>
        {error && (
          <Alert style={{ maxWidth: "90%", margin: "auto" }} variant='danger'>
            {error}
          </Alert>
        )}
        <Card.Body className='text-center'>
          <h2 style={{ marginBottom: "20px" }}>Profile</h2>
          <strong>Email: </strong> {token.email}
          <div className='w-100'>
            <Button variant='link' onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Card.Body>
      </Card>
      <br />
      <Pdf />
    </>
  );
}

export default Dashboard;
