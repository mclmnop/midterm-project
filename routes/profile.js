const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');
const { checkVendorIfCookie, removeNullValues } = require('../lib/db_helpers');

const splitArrayToGroupsOfThree = (items) => {
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
  return itemsArray;
};


module.exports = (db) => {

  router.get("/", (req, res) => {
    const userID = req.session.userId;
    console.log("👉🏻",userID);

    const userFavouritesQuery =
    `SELECT * FROM items
    JOIN favourites ON item_id = items.id
    WHERE favourites.user_id = $1;
    `;

    const isVendor =
    `SELECT is_vendor FROM users
    WHERE id = $1;
    `;

    const vendorItemsQuery = `
    SELECT * FROM items
    WHERE vendor_id = $1
    AND is_active = 'true'
    AND is_sold = 'false';
    `;

    const userInfoQuery = `
    SELECT * FROM users
    WHERE id = $1;
    `;
    Promise.all([
      db.query(userFavouritesQuery, [userID]),
      db.query(vendorItemsQuery, [userID]),
      db.query(isVendor, [userID]),
      db.query(userInfoQuery, [userID])
    ])
      .then(data => {
        const userFavourites = splitArrayToGroupsOfThree(data[0].rows);
        const vendorItems = splitArrayToGroupsOfThree(data[1].rows);
        const isVendor = checkVendorIfCookie(data[2], userID);
        const userInfo = data[3].rows[0];

        console.log('👁userInfo', userInfo);
        //res.json({ items });
        const templateVars = { userFavourites, isVendor, vendorItems, userInfo, userID };
        res.render('profile', templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  console.log("🧿");

  router.post('/edit', (req, res) => {
    let userID = req.session.userId;
    console.log('💊', req.body);
    console.log('🚬',userID);
    let queryParams = [userID];
    let queryString = `
    UPDATE users
    SET `;

    let keysValues = removeNullValues(req.body, queryParams);
    const keys = keysValues[0];
    const values = keysValues[1];
    console.log('🩹', keys, values);

    //adding columns to be modified
    if (queryParams.length === 2) {
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
    console.log('🛡',queryString, queryParams);

    db.query(queryString, queryParams)
      .then(data => {
        res.redirect('/profile');
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });

  });


  return router;
};
