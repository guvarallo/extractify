import React, { useState, useEffect } from "react";
import { Alert, Accordion, Card, Button, Spinner } from "react-bootstrap";
import axios from "axios";

function Pdf() {
  const [error, setError] = useState("");
  const [pdfs, setPdfs] = useState();
  const [firstLoad, setFirstLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const url =
    "https://us-central1-extractify-development.cloudfunctions.net/api";

  useEffect(() => {
    setFirstLoad(true);
    async function getPdfs() {
      try {
        const res = await axios.get(`${url}/pdfs`, {
          headers: { Authorization: localStorage.FBIdToken },
        });
        res.data.map(pdf => {
          return setPdfs([
            {
              id: pdf.pdfId,
              name: pdf.name,
              text: pdf.text,
              user: pdf.userName,
            },
          ]);
        });
        setFirstLoad(false);
      } catch (err) {
        console.error(err);
        setMessage("");
        setError(
          "Unable to fetch PDFs from database, please refresh the page and try again"
        );
        setFirstLoad(false);
      }
    }
    getPdfs();
  }, []);

  async function getOnePdf(id) {
    const res = await axios.get(`${url}/pdf/${id}`);
    res.data.map(pdf => {
      return setPdfs(oldPdfs => [
        ...oldPdfs,
        {
          id: pdf.pdfId,
          name: pdf.name,
          text: pdf.text,
          user: pdf.userName,
        },
      ]);
    });
  }

  async function handlePdfUpload(event) {
    setLoading(true);
    setError("");
    setMessage("");

    const pdf = event.target.files[0];
    const fileInput = document.getElementById("pdfInput");
    fileInput.click();
    const formData = new FormData();
    formData.append("pdf", pdf, pdf.name);

    return await axios
      .post(`${url}/pdf`, formData)
      .then(async res => {
        await getOnePdf(res.data);
        setLoading(false);
        setMessage("File uploaded successfully");
      })
      .catch(err => {
        setError(err.response.data);
        setLoading(false);
      });
  }

  return (
    <>
      {error && (
        <Alert style={{ maxWidth: "90%", margin: "auto" }} variant='danger'>
          {error}
        </Alert>
      )}
      {message && (
        <Alert style={{ maxWidth: "90%", margin: "auto" }} variant='success'>
          {message}
        </Alert>
      )}
      <br />
      {loading ? (
        <div style={{ maxWidth: "90%", margin: "auto" }}>
          <Spinner
            style={{ marginRight: "10px" }}
            animation='grow'
            variant='primary'
          />
          <strong>Parsing your pdf to text, please wait...</strong>
        </div>
      ) : (
        <div style={{ maxWidth: "90%", margin: "auto" }}>
          <strong>Upload your PDF here:</strong> <br />
          <input
            style={{ marginTop: "10px" }}
            type='file'
            id='pdfInput'
            onChange={handlePdfUpload}
          />
        </div>
      )}
      <br />
      {firstLoad && (
        <div style={{ maxWidth: "90%", margin: "auto" }}>
          <Spinner
            style={{ marginRight: "10px" }}
            animation='grow'
            variant='primary'
          />
          <strong>Getting all your PDFs from database...</strong>
        </div>
      )}
      {pdfs &&
        pdfs.map(pdf => {
          return (
            <Accordion style={{ maxWidth: "90%", margin: "auto" }} key={pdf.id}>
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant='link' eventKey='0'>
                    Click here to expand and read {pdf.name}
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey='0'>
                  <Card.Body style={{ maxHeight: "300px", overflow: "auto" }}>
                    {pdf.text}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          );
        })}
    </>
  );
}

export default Pdf;
