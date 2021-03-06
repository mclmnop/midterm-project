const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("login");
  })


  router.post("/", (req, res) => {
    // logs in a a user and redirects to url page if information is valid  otherise sends an error message
    const { email, password } = req.body;

    console.log(email);
    console.log(password);
    res.send("okay");
  });
  return router;
};
