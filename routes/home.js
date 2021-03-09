const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');

module.exports = (db) => {
  // This route is redundant since it is included in the server.js file


  // Get the 10 most favourited items
  router.get("/", (req, res) => {
    const queryString =
    `SELECT DISTINCT items.* FROM items
    JOIN favourites ON items.id = favourites.item_id
    GROUP BY items.id
    LIMIT 10;
    `;
    db.query(queryString, [])
      .then(data => {
        const items = data.rows;
        console.log('👁result allo', items);
        //res.json({ items });
        const templateVars = { featuredItems: items };
        res.render('home', templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  console.log("👽");
  return router;
};
