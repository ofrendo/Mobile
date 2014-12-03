# API Calls
These are the API calls that can be made to the backend.

## User
#### Creating a user
```
POST /user

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
	data: {user: sampleUser}
});
```

This call also logs you in. It is unnecessary to call `/login` after this.

Status codes:
- 200: User creation successful
- 500: User exists already or internal server error


#### Get user data
```
GET /user/:user_id

Sample JSON result:
{
	"user_id":18,
	"email":"hello@wor.ld",
	"username":"helloWorld",
	"name":"Hello World"
}
```

Status codes:
- 200: OK
- 400: Bad request, for example when sending a string instead of a number as `user_id`
- 401: Not logged in
- 404: Not found

#### Update user

Status codes: 
- 501: Not implemented yet

#### Delete user
```
DELETE /user/:user_id
```

Only the user himself may delete the user and he must be logged in.

Status codes:
- 200: OK
- 400: Bad request, for example when sending a string instead of a number as `user_id`
- 401: Not logged in
- 404: Not found

## Session management
#### Login
```
POST /login

//Sample usage:
$.ajax({
	type: "POST",
	url: "/login",
	data: {
		username: sampleUser.username,
		password: sampleUser.password
	},
	success: function(data, textStatus, jqXHR) {
		//On login
	},
	error: function(jqXHR, textStatus, errorThrown) {
		//On error, for example wrong password
	}
});
```

Returns a user JSON object like in `user/:user_id`.

Status codes:
- 200: Successful login
- 401: Error during login

#### Logout
```
POST /logout
```

Status codes:
- 200: Successful login

## Unit testing
Open `/test` in a browser.