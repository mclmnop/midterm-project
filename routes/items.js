/*
 * All routes for Items are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

/* /items get >>> get all items
/items:search >>>  get all items with the user search params
/items/new post >>> post new item
/items/:id get this item id
/items/:id/edit edit this item id*/

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM items;`)
      .then(data => {
        const items = data.rows;
        console.log(items);
        res.json({ items });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/search", (req, res) => {
    const searchWord = req.params.keyword;
    db.query(`SELECT * FROM items WHERE name LIKE '%car%'`)
      .then(data => {
        const items = data.rows;
        console.log(items);
        res.json({ items });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });






  return router;
};
