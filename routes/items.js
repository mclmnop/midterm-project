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

  // outputs list of all items
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

  //outputs searched item for now works with a name
  router.get("/search", (req, res) => {
    const searchWord = "%" + req.query.name + "%";
    let queryParams = [];
    queryParams.push(searchWord);
    const queryString =
    `
      SELECT *
      FROM items
      WHERE name LIKE $1
    `
    db.query(queryString, queryParams)
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

  //needs req.body with values (name, description, price, image_url, vendor_id,)
  router.post("/new", (req, res) => {
    const creation_date = new Date().toISOString();
    let queryParams = ['bottle', '50 years old whiskey', 10000, 'https://bit.ly/3qovxfk', 1, creation_date];
    const queryString =
    `
      INSERT INTO items (name, description, price, image_url, vendor_id, creation_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `
    db.query(queryString, queryParams)
      .then(data => {
        const items = data.rows;
        //console.log(items);
        res.json({ items });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/:id", (req, res) => {
    db.query(`SELECT * FROM items WHERE id = $1`, [req.params.id])
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

  //receives the things to update on an item
  router.post("/:id/edit", (req, res) => {
    db.query(`UPDATE items SET description description = 'new' WHERE id = $1`, [req.params.id])
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
