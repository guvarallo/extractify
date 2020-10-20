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
