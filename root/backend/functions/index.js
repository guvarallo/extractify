const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");

admin.initializeApp();
const app = express();

app.get("/pdfs", (req, res) => {
  admin
    .firestore()
    .collection("pdfs")
    .get()
    .then(data => {
      let pdfs = [];
      data.forEach(doc => {
        pdfs.push(doc.data());
      });
      return res.json(pdfs);
    })
    .catch(err => console.error(err));
});

exports.api = functions.https.onRequest(app);
