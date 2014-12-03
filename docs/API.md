# API Calls
These are the API calls that can be made to the backend.

## User API calls
### Creating a user
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

Status codes:
- 200: User creation successful
- 500: User exists already

