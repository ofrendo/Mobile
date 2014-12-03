var userMgt = require("./userMgt");
var sessionMgt = require("./sessionMgt");

/*
path: path with which to make an API call
method: get, post, put, delete
callback: function to call
*/
function Route(path, method, callback) {
	this.path = path;
	this.method = method;
	this.callback = callback;
}

//These are available elsewhere as router.routes
var router = exports;

router.routes = [
	new Route("/", "get", function(req, res) { //Server status service
		res.send("Server is running.");
	}),
	new Route("/test", "get", function(req, res) {res.redirect("/test/index.html")}),
	new Route("/test/*", "get", function(req, res) { //unit tests for rest api
		var fs = require('fs');
		var path = require('path');

		var filePath = '.' + req.url;
		var extname = path.extname(filePath);
		var contentType = 'text/html';
		switch (extname) {
			case '.js':
				contentType = 'text/javascript';
				break;
			case '.css':
				contentType = 'text/css';
				break;
		}

		fs.readFile(filePath, function(error, content) {
			if (error) {
				res.writeHead(500);
				res.end();
			}
			else {
				res.writeHead(200, { 'Content-Type': contentType });
				res.end(content, 'utf-8');
			}
		});

	}),
	//USER API CALLS
	new Route("/user", "post", function(req, res) { 
		//create a user, send back the ID it was created with
		userMgt.createUser(req.body.user, function(err, result) {
			if (err) {
				res.status(500).send(JSON.stringify({message: "Error during user creation."}));
				console.log("Error during user creation:");
				console.log(err);
			}
			else {
				//If successful redirect to login
				console.log("Created user:");
				console.log(result.rows[0]);
				var user = req.body.user;
				user.user_id = result.rows[0].user_id;
				sessionMgt.setUser(req, user);
				res.status(200).send("");
			}
		});
	}),
	new Route("/login", "post", function(req, res) { //login
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
					res.status(401).send("");
				}
				else {
					console.log("Logging user in:");
					console.log(result);
					sessionMgt.setUser(req, result.rows[0]);
					res.status(200).send(req.session.user);
				}
			});
		}
	}),
	new Route("/logout", "post", function(req, res) { //logout
		sessionMgt.doLogout(req);
		res.status(200).send("");
	}),
	new Route("/user/*", "all", function(req, res, next) {
		if (sessionMgt.isLoggedIn(req)) {
			next();
		}
		else {
			res.status(401).send(JSON.stringify({message: "Not logged in."}));
		}
	}),
	new Route("/user/:user_id", "get", function(req, res) { //get information about a certain user
		var user_id = req.params.user_id;
		console.log(req.url);
		console.log("Retrieving user info for ID: " + user_id);
		userMgt.getUser(user_id, function(err, result) {
			res.send(result.rows[0]);
		});
	}),
	new Route("/user/:user_id", "put", function(req, res) {
		res.status(501).send("");
	}),
	new Route("/user/:user_id", "delete", function(req, res) {
		if (req.params.user_id != req.session.user.user_id) {
			res.status(401).send("");
			return;
		}

		var user_id = req.session.user.user_id;
		userMgt.deleteUser(user_id, function(err, result) {
			console.log("Result user delete:");
			console.log(result);
			var status = (result.rowCount === 1) ? 200 : 500;
			res.status(status).send("");
		});
	})
];

exports.router = router;