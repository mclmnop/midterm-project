const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("login");
  })


  router.post("/", (req, res) => {
    // logs in a a user and redirects to url page if information is valid  otherise sends an error message
    const { email, password } = req.body;
    db.query(`SELECT * FROM users;`)
      .then(data => {
        let users = data.rows;
        for (let user of users) {
          console.log(user.email);
          if (user.email === email) {
            console.log("true");
            return;
          }
        }
        console.log("true");
      })
    res.send("okay");
  });
  return router;
};
