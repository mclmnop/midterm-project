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

const { query } = require('express');
const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  //outputs searched item for now works with a name
  router.get("/", (req, res) => {
    const searchWord = "%" + req.query.search + "%";
    let queryParams = [];
    queryParams.push(searchWord);
    const queryString =
    `
      SELECT *
      FROM items
      WHERE name LIKE $1
      OR description LIKE $1
    `;
    db.query(queryString, queryParams)
      .then(data => {
        const items = data.rows;
        console.log('result allo', items)
        const templateVars = { searchResult: items }
        res.render('search', templateVars)
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  //get item ID info with vendor name
  router.get("/:id", (req, res) => {
    db.query(`
      SELECT items.*, users.name as userfirstlastname
      FROM items
      JOIN users ON items.vendor_id = users.id
      WHERE items.id = $1
      AND is_active = 'true'
      `, [req.params.id])
    .then(data => {
      const items = data.rows[0];
      console.log(items);
      //res.json({ items });

      const templateVars = { searchResult: items }
      res.render('itemSearched_user', templateVars)
    })
    .catch(err => {
      res
      .status(500)
      .json({ error: err.message });
    });
  });

  router.get("/:id/edit", (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
      //res.writeHead(404, {"Content-Type": "text/plain"});
      res.send('You can\'t access this page')
      return;
    }
    db.query(`SELECT * FROM items WHERE id = $1`, [req.params.id])
    .then(data => {
      const items = data.rows[0];
      console.log(items);
      //res.json({ items });
      const templateVars = { searchResult: items }
      res.render('item_edit', templateVars)
    })
    .catch(err => {
      res
      .status(500)
      .json({ error: err.message });
    });
  });

  //needs req.body with values (name, description, price, image_url, vendor_id,), works except for vendor Id
  router.post("/new", (req, res) => {
    console.log(req.body);
    const creation_date = new Date().toISOString();
    let queryParams = [req.body.name, req.body.description, req.body.price, req.body.image_url, 1, creation_date];
    const queryString =
    `
      INSERT INTO items (name, description, price, image_url, vendor_id, creation_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    db.query(queryString, queryParams)
      .then(data => {
        const items = data.rows;
        console.log(items);
        res.render("index");
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  //receives the things to update on an item
  router.post("/:id/edit", (req, res) => {
    //adding the id from the URL as first param
    let queryParams = [req.params.id];
    let userID = req.params.id;

    console.log('allo',req.body)

    let queryString = `
    UPDATE items
    SET `;


    //arrays to update multiple columns
    let keys = [];
    let values = [];

    //looping through body to remove null values
    for (let key in req.body) {
      if (req.body[key] !== '') {
        if (key === 'price') {
          keys.push(key);
          queryParams.push(req.body[key] * 100);
          values.push(`$${queryParams.length}`)
        } else {
          keys.push(key);
          queryParams.push(req.body[key]);
          values.push(`$${queryParams.length}`);
        }
      }
    }
    //if mark as sold button was hit
    if(req.body.sold) {
      queryString += `
      is_sold = true
      WHERE id = $1
      RETURNING *
      `
      queryParams = [userID];
    }
    //adding columns to be modified
     else if (queryParams.length === 2){
      queryString += `
      ${keys} = (${values})
      WHERE id = $1
      RETURNING *
    `
    } else {
      queryString += `
      (${keys}) = (${values})
      WHERE id = $1
      RETURNING *
    `
    }
    console.log(queryString, queryParams)
    db.query(queryString, queryParams)
      .then(data => {
        const items = data.rows;
        console.log(items);
        //res.json({ items });
        res.redirect(`/search/${req.params.id}`)
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/:id/delete", (req, res) => {
    let queryParams = [req.params.id];
    const queryString =
    `
      UPDATE items
      SET is_active = 'false'
      WHERE id = $1
    `;
    db.query(queryString, queryParams)
      .then(data => {
        res.redirect('/home');
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
