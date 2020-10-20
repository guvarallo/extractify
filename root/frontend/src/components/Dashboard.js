import React, { useState, useEffect } from "react";
import { Alert, Accordion, Card, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const [pdfs, setPdfs] = useState(null);
  const history = useHistory();
  const url =
    "https://us-central1-extractify-development.cloudfunctions.net/api";

  useEffect(() => {
    fetch(`${url}/pdfs`, {
      method: "get",
      headers: { Authorization: localStorage.getItem("FBIdToken") },
    })
      .then(res => res.json())
      .then(data => {
        setPdfs(
          data.map(result => ({
            id: result.pdfId,
            name: result.name,
            text: result.text,
          }))
        );
      })
      .catch(err => console.log(err));
  }, []);

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
      {pdfs &&
        pdfs.map(pdf => {
          return (
            <Accordion key={pdf.id} defaultActiveKey='0'>
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant='link' eventKey='0'>
                    {pdf.name}
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey='0'>
                  <Card.Body>{pdf.text}</Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          );
        })}
    </>
  );
}

export default Dashboard;
