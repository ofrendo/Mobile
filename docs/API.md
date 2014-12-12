# API Calls
These are the API calls that can be made to the backend.

## Session management
#### Login
```
POST /auth/login

Required: 
username
password

Returns:
user_id

//Sample usage:
$.ajax({
	type: "POST",
	url: "/auth/login",
	data: {
		username: sampleUser.username,
		password: sampleUser.password
	},
	success: function(data, textStatus, jqXHR) {
		//On login: data.user_id
	},
	error: function(jqXHR, textStatus, errorThrown) {
		//On error, for example wrong password
	}
});
```

`data` in `success` returns a user JSON object like in `user/:user_id`.

Status codes:
- 200: OK
- 400: Error during login

#### Logout
```
POST /auth/logout
```

Status codes:
- 200: Successful logout

## Unit testing
Open `/test` in a browser.

## User
#### Creating a user
```
POST /user

Required: 
user.email
user.username
user.password
user.name

Returns:
user_id

//Sample usage:
var sampleUser = {
	email: "hello@wor.ld",
	username: "helloWorld",
	password: "helloPass",
	name: "Hello World"
};
$.ajax({
	type: "POST",
	url: "/user",
	data: {user: sampleUser},
	success: function(data, textStatus, jqXHR) {
		sampleUser.user_id = data.user_id;
	}
});
```

This call also logs you in. It is unnecessary to call `/login` after this.

Status codes:
- 200: User creation successful
- 400: Bad request, for example not an email adress
- 500: User exists already or internal server error


#### Get user data
```
GET /user/:user_id

Returns:
user_id
email
username
name
```

Status codes:
- 200: OK
- 400: Bad request, for example when sending a string instead of a number as `user_id`
- 401: Not logged in
- 403: Forbidden, trying to access info about other user
- 404: Not found

#### Update user
```
PUT /user/:user_id

Required:
user.email
user.username
user.password
user.name

Returns:
user_id
email
username
name
```

For sample usage see `POST /user`.

Status codes:
- 200: OK
- 400: Bad request, for example when sending a string instead of a number as `user_id`
- 401: Not logged in
- 403: Forbidden, trying to access update other user
- 404: Not found

#### Delete user
```
DELETE /user/:user_id
```

Only the user himself may delete the user and he must be logged in. Also logs the user out.

Status codes:
- 200: OK
- 400: Bad request, for example when sending a string instead of a number as `user_id`
- 401: Not logged in
- 403: Trying to delete a different user (different `user_id`)
- 500: Internal server error trying to delete user

## Trip
All calls described here require a user to be logged in.

Status codes:
- 200: OK
- 400: Bad request, for example when sending a string instead of a number as IDs
- 401: Not logged in
- 403: Trying to read/update/delete a forbidden trip, for example trying to read from another user
- 500: Internal server error

#### Create a trip
```
POST /trip

Required:
trip.name

Optional:
trip.start_date (ISO 6801 format)
trip.end_date (ISO 6801 format)

Returns:
trip_id

//Sample usage:
var sampleTrip = {
	name: "Test trip",
	start_date: (new Date()).toISOString()
};
$.ajax({
	type: "POST",
	url: "/trip",
	data: {trip: sampleTrip},
	success: function(data, textStatus, jqXHR) { //data will be trip_id
		sampleTrip.trip_id = data.trip_id;
	}
});
```

#### Get trip data
```
GET /trip/:trip_id

Returns:
trip_id
name
start_date
end_date
created_on
```

#### Update trip
``` 
PUT /trip/:trip_id

Required:
trip.name

Optional:
trip.start_date (ISO 6801 format)
trip.end_date (ISO 6801 format)

Returns:
trip_id
name
start_date
end_date
created_on
```

#### Delete trip
```
DELETE /trip/:trip_id
```

## City
All calls described here require a user to be logged in.

Status codes:
- 200: OK
- 400: Bad request, for example when sending a string instead of a number as IDs
- 401: Not logged in
- 403: Trying to read/update/delete a forbidden trip, for example trying to read from another user
- 500: Internal server error

#### Create city
```
POST /trip/:trip_id/city

Required: 
city.trip_id
city.name
city.place_id
city.longitude
city.latitude
city.ranking

Optional:
city.start_date
city.end_date

Returns:
city_id
```

#### Get city
```
GET /trip/:trip_id/city/:city_id

Returns:
city_id
trip_id
name
place_id
longitude
latitude
start_date
end_date
ranking
```

#### Update city
```
PUT /trip/:trip_id/city/:city_id

Required: 
city.trip_id
city.name
city.place_id
city.longitude
city.latitude
city.ranking

Optional:
city.start_date
city.end_date

Returns:
city_id
trip_id
name
place_id
longitude
latitude
start_date
end_date
ranking
```

#### Delete city
```
DELETE /trip/:trip_id/city/:city_id
```

## Location
All calls described here require a user to be logged in.

Status codes:
- 200: OK
- 400: Bad request, for example when sending a string instead of a number as IDs
- 401: Not logged in
- 403: Trying to read/update/delete a forbidden trip, for example trying to read from another user
- 500: Internal server error

#### Create location
```
POST /trip/:trip_id/city/:city_id/location

Required:
location.city_id
location.name
location.place_id
location.category
location.longitude
location.latitude
location.ranking

Optional:
location.start_date
location.end_date

Returns:
location_id
```

#### Get location
```
GET /trip/:trip_id/city/:city_id/location/:location_id

Returns:
location_id
city_id
name
place_id
category
longitude
latitude
start_date
end_date
ranking
```

#### Update location
```
PUT /trip/:trip_id/city/:city_id/location/:location_id

Required:
location.city_id
location.name
location.place_id
location.category
location.longitude
location.latitude
location.ranking

Optional:
location.start_date
location.end_date

Returns:
location_id
city_id
name
place_id
category
longitude
latitude
start_date
end_date
ranking
```

#### Delete location
```
DELETE /trip/:trip_id/city/:city_id/location/:location_id
```