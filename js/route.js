var userMgt = require("./userMgt");

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
	new Route("/", "get", function(req, res) { //Hello world service
		res.send("Hello world!");
	}),
	new Route("/test/read", "get", function(req, res) {
		/*db.readTestTable(function(result) {
			res.send(JSON.stringify(result));
		});*/
		res.send("Hello world!");
	}),
	new Route("/test/insert", "get", function(req, res) {
		/*db.insertTestTable(function() {
			res.send("Inserted.");
		});*/
		res.send("Hello world!");
	}), //test methods are all GET so they can be tested in browser
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
				req.session.user = req.body.user;
				req.session.user.userID = result.rows[0].userID;
				//If successful redirect to login
				res.redirect("/user/login"); 
			}
		});
	}),
	new Route("/user/login", "post", function(req, res) { //login
		res.status(200).send("Logged in .");
	}),
	new Route("/user/logout", "post", function(req, res) { //logout

	}),
	new Route("/user/:userID", "get", function(req, res) { //get information about a certain user
		var userID = req.param("userID");
		var result = userMgt.getUser(userID);
		res.send(result);
	})
];


exports.router = router;