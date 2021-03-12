
const searchWithPrice = function(req) {
  //get search word or letter and format it as a parameter for LIKE
  const searchWord = "%" + req.query.search + "%";
  let queryParams = [];
  queryParams.push(searchWord);

  //create variables for min and max price, wihth default values in case they're empty
  if (req.query.search_min_price) {
    queryParams.push(req.query.search_min_price * 100)
  } else {
    queryParams.push(0)
  }
  if (req.query.search_max_price) {
    queryParams.push(req.query.search_max_price * 100)
  } else {
    queryParams.push(2147483647)
  }

  //build query
  const queryString =
  `
    SELECT *
    FROM items
    WHERE (name LIKE $1
    OR description LIKE $1)
    AND price BETWEEN $2 AND $3
    AND is_active = 'true'
  `
  return [queryString, queryParams];
}

const checkifVendor = function(userID, db) {
  console.log('chack if Vendor?', userID);
  if (!userID) {
    return false;
  } else {
    const queryString = `
      SELECT *
      FROM users
      WHERE id = $1;
    `;
    return db.query(queryString, [userID]);
  }
};

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

const removeNullValues = (body, params) => {
  //arrays to update multiple columns
  let keys = [];
  let values = [];
  //looping through body to remove null values
  for (let key in body) {
    if (body[key] !== '') {
      if (key === 'price') {
        keys.push(key);
        params.push(body[key] * 100);
        values.push(`$${params.length}`)
      } else {
        keys.push(key);
        params.push(body[key]);
        values.push(`$${params.length}`);
      }
    }
  }
 return [keys, values];
};


module.exports = { searchWithPrice, checkifVendor, splitArrayToGroupsOfThree, removeNullValues };
const checkVendorIfCookie = (data, userID) => {
  if (userID) {
    return data.rows[0].is_vendor;
  } else {
    return false;
  }
};

module.exports = { searchWithPrice, checkVendorIfCookie };
