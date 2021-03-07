const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("register");
  })

  router.post("/", (req, res) => {
    // logs in a a user and redirects to url page if information is valid  otherise sends an error message
    const { email, password } = req.body;

    let queryString = `
    INSERT INTO users (name, email, password, phone, street, city, province, country, postal_code, is_vendor) VALUES ('Alice', $1, $2, '5144000000', '3410 Rue Peel, Unit 1007', 'Montreal', 'QC', 'CA', 'H3A1W8', FALSE);
    `;
    db.query(queryString, [email, password])
      .then(user => {
          // commentedout password comparison goes here
        res.redirect("/");
        return;
      })
  });
  return router;


};
