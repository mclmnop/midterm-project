
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

const checkifVendor = function(userID, db){
  console.log('chack if Vendor?', userID)
  if (!userID){
    return false;
  } else {
    const queryString =`
      SELECT *
      FROM users
      WHERE id = $1;
    `;
     return db.query(queryString, [userID])
  }
}


module.exports = { searchWithPrice, checkifVendor }
const checkVendorIfCookie = (data, userID) => {
  if (userID) {
    return data.rows[0].is_vendor;
  } else {
    return false;
  }
};

module.exports = { searchWithPrice, checkVendorIfCookie };
