DROP TABLE users;
CREATE TABLE users (
  userID SERIAL PRIMARY KEY,
  email text,
  username text,
  password text,
  name text
);