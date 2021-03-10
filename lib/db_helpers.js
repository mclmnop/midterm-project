
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
  const queryString =`
    SELECT *
    FROM users
    WHERE id = $1;
  `;
   return db.query(queryString, [userID])
/*     .then(data => {
      console.log('chack if Vendor DATA' ,data.rows[0])
      const result = data.rows[0];
      return result.isVendor
    })
    .catch(err => {
      return {error: err.message };
/*       res
        .status(500)
        .json({ error: err.message }); */
    //}); */

}


module.exports = { searchWithPrice, checkifVendor }
