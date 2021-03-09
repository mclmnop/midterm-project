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
    Promise.all([
      db.query(featuredItemsQuery, []),
      db.query(userFavouritesQuery, [userID])
    ])
      .then(data => {
        const items = data[0].rows;
        const featuredItems = splitArrayToGroupsOfThree(items);
        const userFavourites = splitArrayToGroupsOfThree(data[1].rows);
        console.log('👁result allo', userFavourites);
        //res.json({ items });
        const templateVars = { featuredItems, userFavourites, userID };
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
