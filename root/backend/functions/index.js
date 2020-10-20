const functions = require("firebase-functions");
const app = require("express")();
const { getAllPdfs } = require("./handlers/pdfs");
const { signup, login } = require("./handlers/users");

const FBAuth = require("./utils/fbAuth");

app.get("/pdfs", FBAuth, getAllPdfs);
app.post("/signup", signup);
app.post("/login", login);

exports.api = functions.https.onRequest(app);
