# API Calls
These are the API calls that can be made to the backend.

## User
#### Creating a user
```
POST /user
Request body: JSON user object

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
- 403: Forbidden, trying to access info about other user
- 404: Not found

#### Update user
```
PUT /user/:user_id
Request body: JSON user object
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

## Session management
#### Login
```
POST /login

//Sample usage:
$.ajax({
	type: "POST",
	url: "/auth/login",
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