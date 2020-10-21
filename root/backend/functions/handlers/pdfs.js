const { db } = require("../utils/admin");

exports.getAllPdfs = (req, res) => {
  db.collection("pdfs")
    .orderBy("createdAt", "asc")
    .where("userName", "==", req.user.user)
    .get()
    .then(data => {
      let pdfs = [];
      data.forEach(doc => {
        pdfs.push({
          pdfId: doc.id,
          name: doc.data().name,
          text: doc.data().text,
          userName: doc.data().userName,
          createdAt: doc.data().createdAt,
        });
      });
      return res.json(pdfs);
    })
    .catch(err => console.error(err));
};

exports.getOnePdf = (req, res) => {
  const document = db.doc(`/pdfs/${req.params.pdfId}`);
  document
    .get()
    .then(doc => {
      if (!doc.exists) return res.status(404).json({ error: "PDF not found" });

      if (doc.data().userName !== req.user.user) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        document.get().then(doc => {
          let pdf = [
            {
              pdfId: doc.id,
              name: doc.data().name,
              text: doc.data().text,
              userName: doc.data().userName,
              createdAt: doc.data().createdAt,
            },
          ];
          return res.json(pdf);
        });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.postPdf = (req, res) => {
  const BusBoy = require("busboy");
  const fs = require("fs");
  const path = require("path");
  const os = require("os");

  const busboy = new BusBoy({ headers: req.headers });

  let filepath;
  let pdfText;
  let name;

  busboy.on("file", async (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "application/pdf") {
      return res
        .status(400)
        .json({ error: "Wrong file type. Please submit only .pdf files." });
    }

    name = filename;
    filepath = path.join(os.tmpdir(), path.basename(fieldname));
    file.pipe(fs.createWriteStream(filepath));
  });

  busboy.on("finish", async function () {
    const fs = require("fs");
    const pdfParse = require("pdf-parse");

    const pdfFile = fs.readFileSync(filepath);

    await pdfParse(pdfFile).then(data => {
      pdfText = data.text;
    });

    const newPdf = {
      text: pdfText,
      name: name,
      userName: req.user.user,
      createdAt: new Date().toISOString(),
    };

    db.collection("pdfs")
      .add(newPdf)
      .then(doc => {
        return res.json(doc.id);
      })
      .catch(err => {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
      });
  });

  busboy.end(req.rawBody);
};

exports.deletePdf = (req, res) => {
  const document = db.doc(`/pdfs/${req.params.pdfId}`);
  document
    .get()
    .then(doc => {
      if (!doc.exists) return res.status(404).json({ error: "PDF not found" });

      if (doc.data().userName !== req.user.user) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        return document.delete();
      }
    })
    .then(() => res.json({ message: "PDF deleted successfully" }))
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
