const express = require('express');
const users = require('./users');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const userID = req.session.userId;
/*     db.query(`
    SELECT users.name, count(messages.id), messages.item_id, messages.vendor_id FROM users
        JOIN messages on users.id = messages.vendor_id
        WHERE messages.user_id = $1 OR messages.vendor_id =$1
        GROUP BY users.id, messages.item_id, messages.vendor_id;
    `, [userID]) */
    db.query(`
      SELECT distinct sender.name as senderName, sender.id as sender_id,receiver.name as receiverName, receiver.id as receiver_id,msg.message_content, msg.date_created, msg.item_id
      FROM messages msg inner join users sender on msg.sender_id = sender.id
      inner join users receiver on msg.recipient_id = receiver.id
      WHERE sender.id = $1
    `, [userID])
      .then(data => {

        console.log(data.rows);
        const templateVars = { data, userID };
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
    let time = new Date();
    if (userId) {
      db.query(`INSERT INTO messages (sender_id, message_content, date_created, item_id, recipient_id) SELECT $1, $2, $3, $4, vendor_id FROM items WHERE items.id = $4;`, [userId, message, time, req.params.id])
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
    else {
      return res.send("why u no log in")
    }
  });


  router.post("/user/:vendorID/:itemID/new", (req, res) => {
    const userID = req.session.userId;
    const itemID = req.params.itemID;
    const vendorID = req.params.vendorID;


    const { message } = req.body;
    let time = new Date();
    if (userID) {
      db.query(`INSERT INTO messages (user_id, vendor_id, item_id, message_content, date_created) VALUES ($1, $2, $3, $4, $5)`, [userID, vendorID, itemID, message, time])
      .then(result => {
        //need to discuss what goes inside the message form
        console.log(result)
        const message = result;
        console.log('rows after insert ', message)
        return res.redirect("back");
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    }
    else {
      return res.send("why u no log in")
    }
  });

  router.get("/:sender_id/", (req, res) => {
    console.log('getting here?')
    const itemID = req.params.itemId;
    const vendorID = req.params.vendorId;
    const userID = req.session.userId;
    const queryString = `SELECT users.name, array_agg(messages.message_content) as messages, array_agg(messages.date_created) as times FROM users
    JOIN messages on users.id = messages.user_id OR users.id = messages.vendor_id
    WHERE item_id =$1 AND (user_id = $3 OR user_id = $2)
    GROUP BY users.id;`
    db.query(queryString, [req.params.itemId, req.params.vendorId, req.session.userId])
      .then(data => {
        const messages = data.rows[0].messages;
        const times = data.rows[0].times;
        console.log(data.rows[0].messages);
        console.log(data.rows[0].times);
        const templateVars = { messages, userID, times, itemID, vendorID };
        res.render("messageThread", templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  })

  return router;
};


// `SELECT users.name, messages.message_content, items.id FROM messages
//     JOIN users on users.id = messages.user_id
//     JOIN items ON messages.item_id = items.id
//     WHERE users.id = $1
//     GROUP BY items.id;`

// SELECT users.name, array_agg(messages.message_content) as messages FROM users
// JOIN messages on users.id = messages.user_id OR users.id = messages.vendor_id
// GROUP BY users.id;






//main
// select distinct sender.name as sender_name, sender.id as sender_id,
// receiver.name as receiver_name, receiver.id as receiver_id,
// msg.message_content, msg.date_created
// from messages msg inner join users sender on msg.user_id = sender.id
// inner join users receiver on msg.vendor_id = receiver.id
// WHERE sender.id = $1;


// SELECT users.name, count(messages.id), messages.item_id FROM users
//     JOIN messages on users.id = messages.user_id
//     GROUP BY users.id, messages.item_id;



// SELECT users.name, count(messages.id), messages.item_id, messages.vendor_id FROM users
// JOIN messages on users.id = messages.vendor_id
// GROUP BY users.id, messages.item_id, messages.vendor_id;


// SELECT users.name, array_agg(messages.message_content) as messages FROM users
//     JOIN messages on users.id = messages.user_id OR users.id = messages.vendor_id
//     WHERE item_id = 1 AND vendor_id = 2
//     GROUP BY users.id;





/* db.query(`
   SELECT distinct sender.name as senderName, sender.id as sender_id,
   receiver.name as receiverName, receiver.id as receiver_id,
   msg.message_content, msg.date_created, msg.item_id
   FROM messages msg inner join users sender on msg.sender_id = sender.id
   inner join users receiver on msg.recipient_id = receiver.id
   `) */
