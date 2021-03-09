const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const cookie = req.session.userId;
    db.query(`
    select distinct sender.name as sender_name, sender.id as sender_id,
        receiver.name as receiver_name, receiver.id as receiver_id,
        msg.message_content, msg.date_created
    from messages msg inner join users sender on msg.user_id = sender.id
        inner join users receiver on msg.vendor_id = receiver.id;`)
      .then(data => {

        console.log(data.rows);
        const templateVars = { data, cookie };
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

    const { message } = req.body;

    if (userId) {
      db.query(`INSERT INTO messages (user_id, message_content, item_id, vendor_id) SELECT $1, $2, $3, vendor_id FROM items WHERE items.id = $3;`, [userId, message, req.params.id])
      .then(result => {
        //need to discuss what goes inside the message form
        console.log(result)
        const message = result;
        console.log('rows after insert ', message)
        return res.redirect("/messages");
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    }
  });

  return router;
};


// `SELECT users.name, messages.message_content, items.id FROM messages
//     JOIN users on users.id = messages.user_id
//     JOIN items ON messages.item_id = items.id
//     WHERE users.id = $1
//     GROUP BY items.id;`
