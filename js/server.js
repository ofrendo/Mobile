var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var cors = require("cors");
var sessionMgt = require("./sessionMgt");
var router = require("./route");
var chat = require("./chat");

var app = express();
var server = require("http").createServer(app);

var io = require("socket.io").listen(server);
chat.start(io);

var sessionStore = sessionMgt.getSessionStore();
app.use(session({
	secret: "put_a_better_secret_here",
	resave: false,
	saveUninitialized: true,
	store: sessionStore
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

console.log("Starting server...");
for (var i = 0; i < router.routes.length; i++) {
	var route = router.routes[i];
	app[route.method](route.path, route.callback);
	console.log("Added API call " + route.method + " " + route.path);
}

var port = process.env.PORT || 5000;
server.listen(port);



console.log("Server started on port " + port);