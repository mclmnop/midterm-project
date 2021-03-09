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
        let itemsArray = [];
        let subArray = [];
        for (let i = 0; i < items.length; i++) {
          subArray.push(items[i]);
          if ((i + 1) % 3 === 0 && i > 0) {
            itemsArray.push(subArray);
            subArray = [];
          } else if (i + 1 === items.length && subArray.length !== 0) {
            itemsArray.push(subArray);
          }
        }
        console.log('👁result allo', itemsArray);
        //res.json({ items });
        const templateVars = { featuredItems: itemsArray };
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
