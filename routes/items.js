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
const { searchWithPrice, checkVendorIfCookie } = require('../lib/db_helpers');
const nodemailer = require('nodemailer');

let transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {

  }

});

const message = {
  from: 'elonmusk@tesla.com', // Sender address
  to: 'fiveg38978@mailnest.net',         // List of recipients
  subject: 'Design Your Model S | Tesla', // Subject line
  text: 'Have the most fun you can in a car. Get your Tesla today!' // Plain text body
};



module.exports = (db) => {

  //outputs searched item for now works with a name
  router.get("/", (req, res) => {
    const userID = req.session.userId;

    const isVendor =`
      SELECT *
      FROM users
      WHERE id = $1;
    `;

    const query = searchWithPrice(req)
    Promise.all([
      db.query(query[0], query[1]),
      db.query(isVendor, [userID]),
    ])
      .then(data => {
        const items = data[0].rows;
        const isVendor = checkVendorIfCookie(data[1], userID)
        const templateVars = { searchResult: items, userID, isVendor }
        res.render('items_search', templateVars)
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  //get item ID info with vendor name
  router.get("/:id", (req, res) => {
    const userID = req.session.userId;
    const getItemInfo =
    `
      SELECT items.*, users.name as userfirstlastname
      FROM items
      JOIN users ON items.vendor_id = users.id
      WHERE items.id = $1
      AND is_active = 'true'
    `
    let isVendor =
    `
      SELECT is_vendor
      FROM users
      WHERE id = $1;
    `;
    Promise.all([
      db.query(getItemInfo, [req.params.id]),
      db.query(isVendor, [userID])
    ])
    .then(data => {
      console.log('item page item info ',data[0].rows[0], 'user ID', userID )
      const items = data[0].rows[0];
      if(!userID){
        isVendor = false;
      } else {
        isVendor = data[1].rows[0].is_vendor;
      }
      const templateVars = { searchResult: items, userID, isVendor }
      if (isVendor){
        res.render('itemSearched_vendor', templateVars)
      } else {
        res.render('itemSearched_user', templateVars)
      }
    })
    .catch(err => {
      res
      .status(500)
      .json({ error: err.message });
    });
  });

  router.get("/:id/edit", (req, res) => {
    const userID = req.session.userId;

    if (!userID) {
      res.redirect('/login')
      return;
    }
    const getItemInfo =
    `
      SELECT *
      FROM items
      WHERE id = $1
    `
    const isVendor =
    `
      SELECT *
      FROM users
      WHERE id = $1;
    `;
    Promise.all([
      db.query(getItemInfo, [req.params.id]),
      db.query(isVendor, [userID])
    ])
    //db.query(`SELECT * FROM items WHERE id = $1`, [req.params.id])
    .then(data => {
      const items = data[0].rows[0];
      const user = data[1].rows[0];
      console.log(items);
      //res.json({ items });
      const templateVars = { searchResult: items, userID }
      console.log('data rows 1',data[1].rows[0].is_vendor)
      if (user.is_vendor === true && items.vendor_id === user.id){
        res.render('item_edit', templateVars)
      } else {
        res.redirect('/home')
      }

    })
    .catch(err => {
      res
      .status(500)
      .json({ error: err.message });
    });
  });

  router.get("/item/new", (req, res) => {
    const userID = req.session.userId;

    if (!userID) {
      res.redirect('/login')
      return;
    }
    const getItemInfo =
    `
      SELECT *
      FROM items
      WHERE id = $1
    `
    const isVendor =
    `
      SELECT is_vendor
      FROM users
      WHERE id = $1;
    `;
    Promise.all([
      db.query(getItemInfo, [req.params.id]),
      db.query(isVendor, [userID])
    ])
    //db.query(`SELECT * FROM items WHERE id = $1`, [req.params.id])
    .then(data => {
      const items = data[0].rows[0];
      console.log(items);
      //res.json({ items });
      const templateVars = { searchResult: items, userID }
      console.log('data rows 1',data[1].rows[0].is_vendor)
      if (data[1].rows[0].is_vendor === true){
        res.render('item_new', templateVars)
      } else {
        res.redirect('/home')
      }

    })
    .catch(err => {
      res
      .status(500)
      .json({ error: err.message });
    });
  });

  //needs req.body with values (name, description, price, image_url, vendor_id,), works except for vendor Id
  router.post("/item/new", (req, res) => {
    console.log(req.body);
    const creation_date = new Date().toISOString();
    const vendor = req.session.userId;
    let queryParams = [req.body.name, req.body.description, req.body.price * 100, req.body.image_url, vendor, creation_date];
    const queryString =
    `
      INSERT INTO items (name, description, price, image_url, vendor_id, creation_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    console.log(queryString, queryParams)
    db.query(queryString, queryParams)
      .then(data => {
        const items = data.rows;
        console.log(items);
        res.redirect("/home");
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

    //adding columns to be modified, if only one argument, remvoeve parenthesis in query
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
        res.redirect(`/items/${req.params.id}`)
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

  router.post("/:id/favourites", (req, res) => {
    const item_id = req.params.id;
    const user_id = req.session.userId;

    const queryString =
    `
      INSERT INTO
      favourites(item_id, user_id)
      VALUES ($1, $2)
    `;
    db.query(queryString, [item_id, user_id])
      .then(data => {
        res.redirect('/profile')
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/:id/contact", (req, res) => {
    const item_id = req.params.id;
    const user_id = req.session.userId;
        //if mark as sold button was hit
        if(req.body.sendNotif) {
          console.log('Buyer? 💍', req.body.buyer_id)

        }
    const queryString =
    `
      SELECT *
      from users
      WHERE id = $1
    `;

    db.query(queryString, [req.body.buyer_id])
      .then(data => {
        //console.log(data);
        transport.sendMail(message, function(err, info) {
          if (err) {
            console.log(err)
          } else {
            console.log(info);
          }
      });

        res.redirect(`/items/${item_id}/edit`)
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });


  return router;
};
