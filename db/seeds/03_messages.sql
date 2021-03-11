INSERT INTO messages (sender_id, recipient_id, item_id, message_content, date_created) VALUES ('1', '2', '1', 'Hello', '2021-03-08T07:00:00.000Z');

INSERT INTO messages (sender_id, recipient_id, item_id, message_content, date_created) VALUES ('1', '2', '2', 'Hello, my name is Alice, I want to make a small purchase of item 2', '2021-03-08T07:00:00.000Z');

INSERT INTO messages (sender_id, recipient_id, item_id, message_content, date_created) VALUES ('1', '2', '3', 'Hello, my name is Alice, I want to make a small purchase of item 3 ', '2021-03-09T08:00:00.000Z');

INSERT INTO messages (sender_id, recipient_id, item_id, message_content, date_created) VALUES ('2', '1', '3', 'Hello, Miranda, item 3 is 400$ ', '2021-03-09T09:00:00.000Z');

-- SELECT users.name, array_agg(messages.message_content) as messages, array_agg(messages.date_created) as times FROM users
--     JOIN messages on users.id = messages.user_id OR users.id = messages.vendor_id
--     WHERE item_id =$1 AND vendor_id = $2 AND user_id = $3
--     GROUP BY users.id;


