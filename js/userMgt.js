var db = require("./db");
var crud = require("./crud");
var sessionMgt = require("./sessionMgt");

exports.crud = new crud.CRUDModule("user",
	function(user) {
		return {
			text: "INSERT INTO users (email, username, password, name) " +
				  " VALUES($1, $2, crypt($3, gen_salt('bf', 8)), $4) " + 
				  " RETURNING user_id",
			values: [user.email, user.username, user.password, user.name]
		};
	},
	function(user_id) {
		return {
			text: "SELECT * FROM users WHERE user_id=$1",
			values: [user_id]
		};
	},
	function(user) {
		return {
			text: "UPDATE users SET email=$1, username=$2, password=crypt($3, password), name=$4 WHERE user_id=$5",
			values: [user.email, user.username, user.password, user.name, user.user_id]
		};
	},
	function(user_id) {
		return {
			text: "DELETE FROM users WHERE user_id=$1",
			values: [user_id]
		};
	}
);

exports.crud.beforeSendCreate = function(req, res, user) {
	sessionMgt.setUser(req, user);
}
exports.crud.beforeSendRead = function(req, res, user) {
	delete user["password"];
}
exports.crud.beforeSQLCheckUpdate = function(req, res, user) {
	return req.session.user.user_id == user.user_id;
}
exports.crud.beforeSendUpdate = function(req, res, user) {
	delete user["password"];
}
exports.crud.beforeSendDelete = function(req, res) {
	sessionMgt.doLogout();
}

exports.crud.onAll = function(req, res, next) {
	var user_id = req.params.user_id;
	if (isNaN(user_id)) {
		res.status(400).send("");
		return;
	}
	if (req.params.user_id != req.session.user.user_id) {
		res.status(403).send("");
		return;
	}
	next();
};

function doLogin(username, password, callback) {
	var sql = {
		text: "SELECT * FROM users WHERE username=$1 " + 
			  " AND password=crypt($2, password)",
		values: [username, password]
	};
	db.query(sql, callback);
}
exports.onLogin = function(req, res) { //login
	if (sessionMgt.isLoggedIn(req)) {
		//Already logged in
		console.log("User already logged in.");
		res.status(200).send(req.session.user);
	}
	else {
		var username = req.body.username;
		var password = req.body.password;
		doLogin(username, password, function(err, result) {
			if (err || result.rows.length === 0) {
				res.status(400).send("");
			}
			else {
				console.log("Logging user in:");
				console.log(result.rows[0]);
				sessionMgt.setUser(req, result.rows[0]);
				res.status(200).send(req.session.user);
			}
		});
	}
};

exports.onLogout = function(req, res) { //logout
	sessionMgt.doLogout(req);
	res.status(200).send("");
}

/*
var userMgt = exports;

userMgt.createUser = function(user, callback) {
	var sql = {
		text: "INSERT INTO users (email, username, password, name) " +
			  " VALUES($1, $2, crypt($3, gen_salt('bf', 8)), $4) " + 
			  " RETURNING user_id",
		values: [user.email, user.username, user.password, user.name]	
	};
	db.query(sql, callback);
}

userMgt.getUser = function(user_id, callback) {
	var sql = {
		text: "SELECT * FROM users WHERE user_id=$1",
		values: [user_id]
	}
	db.query(sql, callback);
}

userMgt.updateUser = function(user, callback) {
	var sql = {
		text: "UPDATE users SET email=$1, username=$2, password=crypt($3, password), name=$4 WHERE user_id=$5",
		values: [user.email, user.username, user.password, user.name, user.user_id]
	};
	db.query(sql, callback);
}

userMgt.deleteUser = function(user_id, callback) {
	var sql = {
		text: "DELETE FROM users WHERE user_id=$1",
		values: [user_id]
	}
	db.query(sql, callback);
}

userMgt.doLogin = function(username, password, callback) {
	var sql = {
		text: "SELECT * FROM users WHERE username=$1 " + 
			  " AND password=crypt($2, password)",
		values: [username, password]
	};
	db.query(sql, callback);
}
userMgt.onLogin = function(req, res) { //login
	if (sessionMgt.isLoggedIn(req)) {
		//Already logged in
		console.log("User already logged in.");
		res.status(200).send(req.session.user);
	}
	else {
		var username = req.body.username;
		var password = req.body.password;
		userMgt.doLogin(username, password, function(err, result) {
			if (err || result.rows.length === 0) {
				res.status(400).send("");
			}
			else {
				console.log("Logging user in:");
				console.log(result.rows[0]);
				sessionMgt.setUser(req, result.rows[0]);
				res.status(200).send(req.session.user);
			}
		});
	}
};

userMgt.onLogout = function(req, res) { //logout
	sessionMgt.doLogout(req);
	res.status(200).send("");
}

userMgt.onCreateUser = function(req, res) { 
	//create a user, send back the ID it was created with
	userMgt.createUser(req.body.user, function(err, result) {
		if (err) {
			res.status(500).send(JSON.stringify({message: "Error during user creation."}));
			console.log("Error during user creation:");
			console.log(err);
		}
		else {
			console.log("Created user:");
			console.log(result.rows[0]);
			var user = req.body.user;
			user.user_id = result.rows[0].user_id;
			sessionMgt.setUser(req, user);
			res.send(user.user_id);
		}
	});
}

userMgt.onUserCRUD = function(req, res, next) {
	var user_id = req.params.user_id;
	if (isNaN(user_id)) {
		res.status(400).send("");
		return;
	}
	if (req.params.user_id != req.session.user.user_id) {
		res.status(403).send("");
		return;
	}
	next();
}

userMgt.onGetUser = function(req, res) { //get information about a certain user
	var user_id = req.params.user_id;
	console.log(req.url);
	console.log("Retrieving user info for ID: " + user_id);
	userMgt.getUser(user_id, function(err, result) {
		if (result.rows.length === 1) {
			var userData = result.rows[0];
			delete userData["password"];
			res.send(userData);
		}
		else {
			res.status(404).send("");
		}
		
	});
}

userMgt.onUpdateUser = function(req, res) {
	var newUser = req.body.user;
	if (newUser.user_id != req.session.user.user_id) { //need to check if user  being sent is actually the own user
		res.status(403).send("");
		return;
	}

	userMgt.updateUser(newUser, function(err, result) {
		if (err) {
			res.status(500).send("");
		}
		else {
			res.send(newUser);
		}
	});
}

userMgt.onDeleteUser = function(req, res) {
	var user_id = req.session.user.user_id;
	userMgt.deleteUser(user_id, function(err, result) {
		console.log("Result user delete:");
		console.log(result);
		if (result.rowCount === 1) {
			sessionMgt.doLogout(req);
			res.status(200).send("");
		}
		else {
			res.status(500).send("");
		}
	});
}

exports.userMgt = userMgt;
*/



