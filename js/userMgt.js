var db = require("./db");

var sampleUser = {
	email: "hello@wor.ld",
	username: "helloWorld",
	password: "helloPass",
	name: "Hello World"
};

var userMgt = exports;

userMgt.createUser = function(user, callback) {
	//Use sample user for now
	user = sampleUser;
	var sql = "INSERT INTO users (email, username, password, name) VALUES('" + user.email + "', '" + user.username + "', '" + user.password + "', '" + user.name + "') RETURNING userID";
	db.query(sql, callback);
}

userMgt.getUser = function(userID) {
	var sql = "SELECT * FROM users WHERE userID=" + userID;
}


















exports.userMgt = userMgt;



