# API Calls
These are the API calls that can be made to the backend.

## User
Creating a user
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
- 500: User exists already



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

Status codes:
- 200: Successful login
- 401: Error during login

#### Logout
```
POST /logout
```

## Unit testing
Open `/test` in a browser.