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
	new Route("/user", "post", userMgt.onCreateUser),
	new Route("/login", "post", userMgt.onLogin),
	new Route("/logout", "post", userMgt.onLogout),
	new Route("/user/*", "all", sessionMgt.onCheckSession),
	new Route("/user/:user_id", "all", userMgt.onUserCRUD),
	new Route("/user/:user_id", "get", userMgt.onGetUser),
	new Route("/user/:user_id", "put", userMgt.onUpdateUser),
	new Route("/user/:user_id", "delete", userMgt.onDeleteUser)
];

exports.router = router;