var cookieParser = require("cookie-parser");
var db = require("./db");
var userMgt = require("./userMgt");
var sessionMgt = require("./sessionMgt");

exports.start = function(io, cookieParser) {
	console.log("Started chat...");
	io.on("connection", onConnect);
}

var currentRooms = [];
var onConnect = function(socket) {
	//socket.user needs to be the session: Get that from the cookie
	var cookie = socket.client.request.headers.cookie;
	sessionMgt.getSessionFromCookie(cookie, function(session) {
		if (!session) {
			socket.disconnect();
		}
		else {
			socket.user = session.user;
		}
	});

	socket.on("room.join", function (data) { //data needs to include the trip_id
		var trip_id = data.trip_id;
		var user = socket.user;
		if (!currentRooms[trip_id]) 
			currentRooms[trip_id] = [];

		currentRooms[trip_id].push(user);

		socket.join("room" + trip_id);
		socket.broadcast.to(trip_id).emit("room.joined", user);
		console.log("User " + user.user_id + " has joined room for trip " + trip_id);
	});

	socket.on("room.msg", function(id, data) {
		var msg = data.msg;

	});

	socket.on("disconnect", function() {

	})
}

