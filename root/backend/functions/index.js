const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = require("express")();
const config = require("./utils/config");

admin.initializeApp();

const firebase = require("firebase");
firebase.initializeApp(config);

const db = admin.firestore();

const { validateSignupData, validateLoginData } = require("./utils/validators");

app.get("/pdfs", (req, res) => {
  db.collection("pdfs")
    .orderBy("createdAt", "asc")
    .get()
    .then(data => {
      let pdfs = [];
      data.forEach(doc => {
        pdfs.push({
          pdfId: doc.id,
          text: doc.data().text,
          userName: doc.data().userName,
          createdAt: doc.data().createdAt,
        });
      });
      return res.json(pdfs);
    })
    .catch(err => console.error(err));
});

app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    user: req.body.user,
  };

  const { errors, valid } = validateSignupData(newUser);

  if (!valid) return res.status(400).json(errors);

  let token, userId;
  db.doc(`/users/${newUser.user}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res.status(400).json({ user: "This username is already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(resToken => {
      token = resToken;
      const userCredentials = {
        user: newUser.user,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId,
      };
      return db.doc(`/users/${newUser.user}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch(err => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "Email is already in use" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
});

app.post("/login", (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const { errors, valid } = validateLoginData(user);

  if (!valid) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(token => res.json({ token }))
    .catch(err => {
      console.log(err);
      return res
        .status(403)
        .json({ general: "Wrong credentials, please try again." });
    });
});

exports.api = functions.https.onRequest(app);
