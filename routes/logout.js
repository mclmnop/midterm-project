const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');

module.exports = (db) => {
  router.post('/', (req, res) => {
    req.session = null;
    res.redirect("/");
  });
  return router;
};


// $2b$12$1O6bB1D7YPdYLFN7olLDceK.7R7YJQoPb0m0RhHEDSrW4xqBY3BKO
