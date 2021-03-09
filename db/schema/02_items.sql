-- Drop and recreate Users table (Example)

DROP TABLE IF EXISTS items CASCADE;

CREATE TABLE items (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  vendor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  creation_date TIMESTAMP,
  is_active VARCHAR(255) NOT NULL DEFAULT TRUE,
  is_sold VARCHAR(255) NOT NULL DEFAULT FALSE
);
