const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');

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

const checkVendorIfCookie = (data, userID) => {
  if (userID) {
    return data[3].rows[0].is_vendor;
  } else {
    return false;
  }
};

module.exports = (db) => {

  // Get the 10 most favourited items
  router.get("/", (req, res) => {
    const userID = req.session.userId;
    console.log("👉🏻",userID);
    const featuredItemsQuery =
    `SELECT DISTINCT items.* FROM items
    JOIN favourites ON items.id = favourites.item_id
    WHERE items.is_active = 'true'
    GROUP BY items.id
    LIMIT 10;
    `;

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
      db.query(featuredItemsQuery, []),
      db.query(userFavouritesQuery, [userID]),
      db.query(vendorItemsQuery, [userID]),
      db.query(isVendor, [userID]),
      db.query(userInfoQuery, [userID])
    ])
      .then(data => {
        const featuredItems = splitArrayToGroupsOfThree(data[0].rows);
        const userFavourites = splitArrayToGroupsOfThree(data[1].rows);
        const vendorItems = splitArrayToGroupsOfThree(data[2].rows);
        const isVendor = checkVendorIfCookie(data, userID);
        const userInfo = data[4].rows[0];

        console.log('👁userInfo', userInfo);
        //res.json({ items });
        const templateVars = { featuredItems, userFavourites, isVendor, vendorItems, userID };
        res.render('profile', templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  console.log("👽");

  router.post('/edit', (req, res) => {
    let queryParams = [req.params.id];
  });


  return router;
};


// post like search page /:id/:edit
// Do a DB update, not an instert
