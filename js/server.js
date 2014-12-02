var express = require("express");
var app = express();

function start(router) {
	console.log("Starting server...");
	for (var i = 0; i < router.routes.length; i++) {
		var route = router.routes[i];
		app[route.method](route.path, route.callback);
		console.log("Added API call " + route.path);
	}

	var port = process.env.PORT || 5000;
	app.listen(port);
	console.log("Server started on port " + port);
}

exports.start = start;