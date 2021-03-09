const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const cookie = req.session.userId;
    db.query(`SELECT users.name, messages.message_content FROM messages
    JOIN users on users.id = messages.vendor_id;`)
      .then(data => {

        const messages = data.rows;
        console.log(messages)
        const templateVars = { messages, cookie };
        res.render("messages", templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/:id/new", (req, res) => {
    const userId = req.session.userId;
    console.log(req.params);

    const { message } = req.body;

    if (userId) {
      db.query(`INSERT INTO messages (user_id, message_content, item_id) VALUES ($1, $2, $3);`,[userId, message, req.params.id])
      .then(data => {
        //need to discuss what goes inside the message form
        const message = data.rows;
        console.log(message)
        return res.redirect("/messages");
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    }
    else {
      res.send("Please login/register if you want to send a message.")
    }
  });

  return router;
};
