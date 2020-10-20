const functions = require("firebase-functions");
const app = require("express")();
const cors = require("cors");

const { getAllPdfs, postPdf, deletePdf } = require("./handlers/pdfs");
const { signup, login, getUser } = require("./handlers/users");

const FBAuth = require("./utils/fbAuth");

app.use(cors());

app.get("/pdfs", FBAuth, getAllPdfs);
app.post("/pdf", FBAuth, postPdf);
app.delete("/pdf/:pdfId", FBAuth, deletePdf);
app.post("/signup", signup);
app.post("/login", login);
app.get("/user", FBAuth, getUser);

exports.api = functions.https.onRequest(app);
