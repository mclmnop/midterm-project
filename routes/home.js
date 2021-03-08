const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');

module.exports = (db) => {
  // This route is redundant since it is included in the server.js file
  router.get("/", (req, res) => {
    res.render("home");
  });

  // Get the 10 most favourited items
  // router.get("/", (req, res) => {
  //   const queryString =
  //   `SELECT DISTINCT items.* FROM items
  //   JOIN favourites ON items.id = favourites.item_id
  //   GROUP BY items.id
  //   LIMIT 10;
  //   `;
  //   db.query(queryString, queryParams)
  //     .then(data => {
  //       const items = data.rows;
  //       console.log('result allo', items);
  //       //res.json({ items });
  //       const templateVars = { searchResult: items };
  //       res.render('index', templateVars);
  //     })
  //     .catch(err => {
  //       res
  //         .status(500)
  //         .json({ error: err.message });
  //     });
  // });

  // // Redirects to the search page
  // // To implement: take input from search form, query database based on search terms
  // router.post("/search", (req, res) => {

  //   // This view doesn't exist yet!
  //   res.redirect('/search');
  // });

  return router;
};
