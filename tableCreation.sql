DROP TABLE IF EXISTS message;
DROP TABLE IF EXISTS location;
DROP TABLE IF EXISTS destination;
DROP TABLE IF EXISTS user_trip;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS trip;

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  username VARCHAR(30) NOT NULL UNIQUE,
  password VARCHAR(112) NOT NULL,
  name VARCHAR(100)
);

INSERT INTO users 
	(email,username,password,name)
	VALUES ('chat_user@gmail.com', 'chat_user', crypt('chat', gen_salt('bf', 8)), 'Chat user');

CREATE TABLE trip (
	trip_id SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
	start_date TIMESTAMP, 
	end_date TIMESTAMP
); 

CREATE TABLE user_trip (
	user_id INT REFERENCES users(user_id),
	trip_id INT REFERENCES trip(trip_id)
);

CREATE TABLE destination (
	destination_id SERIAL PRIMARY KEY,
	trip_id  INT REFERENCES trip(trip_id),
	name VARCHAR(50) NOT NULL,
	place_id VARCHAR(27),
	longitude DECIMAL(10, 7) NOT NULL,
	latitude DECIMAL(10, 7) NOT NULL,
	start_date TIMESTAMP,
	end_date TIMESTAMP,
	created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
	ranking INT
);

CREATE TABLE location (
	location_id SERIAL PRIMARY KEY,
	destination_id INT REFERENCES destination(destination_id),
	name VARCHAR(50) NOT NULL,
	place_id VARCHAR(27),
	category VARCHAR(50),
	longitude DECIMAL(10, 7) NOT NULL,
	latitude DECIMAL(10, 7) NOT NULL,
	start_date TIMESTAMP,
	end_date TIMESTAMP,
	created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	ranking INT
);

CREATE TABLE message (
	msg_id SERIAL PRIMARY KEY,
	user_id INT REFERENCES users(user_id),
	trip_id INT REFERENCES trip(trip_id),
	msg_text TEXT NOT NULL,
	created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);