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
			delete socket.user["email"];
		}
	});

	socket.on("room.join", function (data) { //data needs to include the trip_id
		var trip_id = data.trip_id;
		var user = socket.user;

		//Check if user is allowed to join this room, if not disconnect ::TODO::

		if (!currentRooms[trip_id]) 
			currentRooms[trip_id] = [];

		currentRooms[trip_id].push(user);

		socket.room = "room" + trip_id;
		socket.trip_id = trip_id;

		socket.join(socket.room);

		//Load previous messages from DB ::TODO::
		socket.emit("room.previousMessages", []); //TODO

		socket.broadcast.to(socket.room).emit("room.userJoined", user);
		console.log("User " + user.username + " has joined room for trip " + trip_id);
	});

	socket.on("msg.send", function(data) { //data needs to include msg_text
		if (!socket.trip_id) {
			console.log("User " + socket.user.username + " tried to send without joining room");
			socket.disconnect();
			return;
		}

		var user = socket.user;
		var message = {
			user: user,
			trip_id: socket.trip_id,
			msg_text: data.msg_text
		};
		//Enter into DB table ::TODO::
		message.msg_id = 1; //TODO
		
		socket.broadcast.to(socket.room).emit("msg.new", message);
		socket.emit("msg.sent", message);

		console.log("User " + user.username + " has sent a message: " + message.msg_text);
	});

	socket.on("room.leave", function() {
		leaveRoom(socket);
		socket.emit("room.left");
	});

	socket.on("disconnect", function() {
		leaveRoom(socket);
	});

}

function leaveRoom(socket) {
	var user = socket.user;
	var trip_id = socket.trip_id;

	var index = currentRooms[trip_id].indexOf(user);
	if (index != -1) {
		currentRooms[trip_id].splice(index, 1);
		socket.broadcast.to(socket.room).emit("room.userLeft", user);
		console.log("User " + user.username + " has left room for trip " + trip_id);
	}
}