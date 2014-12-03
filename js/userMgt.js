var db = require("./db");
var cryptoMgt = require("./cryptoMgt");

var userMgt = exports;

userMgt.createUser = function(user, callback) {
	user.password = cryptoMgt.hashPassword(user.password);
	var sql = "INSERT INTO users (email, username, password, name) VALUES('" + user.email + "', '" + user.username + "', '" + user.password + "', '" + user.name + "') RETURNING user_id";
	db.query(sql, callback);
}

userMgt.getUser = function(user_id, callback) {
	var sql = "SELECT * FROM users WHERE user_id=" + user_id;
	console.log(sql);
	db.query(sql, callback);
}

userMgt.deleteUser = function(user_id, callback) {
	var sql = "DELETE FROM users WHERE user_id=" + user_id;
	db.query(sql, callback);
}

userMgt.doLogin = function(username, password, callback) {
	var hashedPW = cryptoMgt.hashPassword(password);
	var sql = "SELECT * FROM users WHERE username='" + username + "'" + 
			  " AND password='" + hashedPW + "'";
	db.query(sql, callback);
}
















exports.userMgt = userMgt;



