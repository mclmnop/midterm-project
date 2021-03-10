INSERT INTO messages (user_id, vendor_id, item_id, message_content, date_created) VALUES ('1', '2', '1', 'Hello', '2021-03-08T07:00:00.000Z');

INSERT INTO messages (user_id, vendor_id, item_id, message_content, date_created) VALUES ('1', '2', '2', 'Hello, my name is Alice, I want to make a small purchase', '2021-03-08T07:00:00.000Z');

INSERT INTO messages (user_id, vendor_id, item_id, message_content, date_created) VALUES ('1', '2', '3', 'Hello, my name is Miriam, I want to make a small purchase', '2021-03-08T08:00:00.000Z');

-- SELECT users.name, array_agg(messages.message_content) as messages, array_agg(messages.date_created) as times FROM users
--     JOIN messages on users.id = messages.user_id OR users.id = messages.vendor_id
--     WHERE item_id =$1 AND vendor_id = $2 AND user_id = $3
--     GROUP BY users.id;


