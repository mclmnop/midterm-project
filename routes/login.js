const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("login");
  })



  router.post("/", (req, res) => {
    // logs in a a user and redirects to url page if information is valid  otherise sends an error message
    const { email, password } = req.body;
    db.query(`
    SELECT * FROM users
    WHERE LOWER(email) = LOWER($1);
    `, [email])
      .then(user => {
        if (user.rows[0]) {
          // commentedout password comparison goes here
          res.send("You are now logged in.");
          return;
        }
        res.send({error: "Log In error."});
      })
  });
  return router;
};


// if (bcrypt.compareSync(password, user.rows[0].password)) {
//   return user.rows[0];
// }
