const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');
const { checkVendorIfCookie } = require('../lib/db_helpers');

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

  // Get the 10 most favourited items
  router.get("/", (req, res) => {
    const userID = req.session.userId;
    console.log("👉🏻",userID);
    const featuredItemsQuery =
    `SELECT DISTINCT items.* FROM items
    JOIN favourites ON items.id = favourites.item_id
    WHERE items.is_active = 'true'
   AND items.is_sold = 'false'
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
    Promise.all([
      db.query(featuredItemsQuery, []),
      db.query(userFavouritesQuery, [userID]),
      db.query(vendorItemsQuery, [userID]),
      db.query(isVendor, [userID])
    ])
      .then(data => {
        const featuredItems = splitArrayToGroupsOfThree(data[0].rows);
        const userFavourites = splitArrayToGroupsOfThree(data[1].rows);
        const vendorItems = splitArrayToGroupsOfThree(data[2].rows);
        const isVendor = checkVendorIfCookie(data[3], userID);

        console.log('🧰',userFavourites);
        //res.json({ items });
        const templateVars = { featuredItems, userFavourites, isVendor, vendorItems, userID };
        res.render('home', templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  // console.log("👽");
  return router;
};
