var db = require("./db");

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
exports.routes = [
	new Route("/", "get", function(req, res) { //Hello world service
		res.send("Hello world!");
	}),
	new Route("/test/read", "get", function(req, res) {
		db.readTestTable(function(result) {
			res.send(JSON.stringify(result));
		});
	}),
	new Route("/test/insert", "get", function(req, res) {
		db.insertTestTable(function() {
			res.send("Inserted.");
		});
	})//test methods are all GET so they can be tested in browser
];