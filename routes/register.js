const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("register");
  })

  router.post("/", (req, res) => {
    // logs in a a user and redirects to url page if information is valid  otherise sends an error message
    let isVend = true;
    const { name, email, password, phone, street, city, province, country, postalCode, isVendor} = req.body;

    if (!isVendor) {
      isVend = false;
    }

    const userPassword = bcrypt.hashSync(password, 12);

    let queryString = `
    INSERT INTO users (name, email, password, phone, street, city, province, country, postal_code, is_vendor) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
    `;
    db.query(queryString, [name, email, userPassword, phone, street, city, province, country, postalCode, isVend])
      .then(user => {
          // commentedout password comparison goes here
        console.log(user.rows);
        req.session = {
          userId: user.rows[0].id
        }
        res.redirect("/");
        return;
      })
  });
  return router;
};
