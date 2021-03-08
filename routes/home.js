const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("index");
  });


  // Redirects to the search page
  // To implement: query database based on search terms
  router.post("/", (req, res) => {

    // This view doesn't exist yet!
    res.redirect('/search');
  });
};
