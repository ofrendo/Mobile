var db = require("./db");
var userMgt = require("./userMgt");
var tripMgt = require("./tripMgt");
var sessionMgt = require("./sessionMgt");

exports.start = function(io) {
	console.log("Started chat...");
	io.on("connection", onConnect);
}

var currentRooms = [];
var onConnect = function(socket) {
	//socket.user needs to be the session: Get that from the cookie
	var cookie = socket.client.request.headers.cookie;
	sessionMgt.getSessionFromCookie(cookie, function(session) {
		if (!session || !session.user) {
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

		//Check if user is allowed to join this room, if not disconnect
		tripMgt.isUserAllowed(user.user_id, trip_id, function(result) {
			if (result === false) {
				socket.disconnect();
			}
			else {

				var sql = {
					text: "SELECT message.user_id, username, name, trip_id, msg_id, msg_text, created_on FROM users, message" +
						  " WHERE message.trip_id=$1 " +
						  "   AND users.user_id = message.user_id" +
						  " ORDER BY created_on" +
						  " LIMIT 100",
					values: [trip_id]
				};
				db.query(sql, function(err, result) {
					if (err) {
						console.log("Error retrieving previous chat messages:");
						console.log(err);
						socket.disconnect();
					}
					else {
						if (!currentRooms[trip_id]) 
							currentRooms[trip_id] = [];

						currentRooms[trip_id].push(user);

						socket.room = "room" + trip_id;
						socket.trip_id = trip_id;

						socket.join(socket.room);


						socket.emit("room.previousMessages", result.rows); //TODO

						socket.broadcast.to(socket.room).emit("room.userJoined", user);
						console.log("User " + user.username + " has joined room for trip " + trip_id);
					}
				})
			}
		});
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
		
		var sql = {
			text: "INSERT INTO message (user_id, trip_id, msg_text) VALUES ($1, $2, $3) RETURNING msg_id",
			values: [user.user_id, socket.trip_id, message.msg_text]
		};
		db.query(sql, function(err, result) {
			if (err) {
				console.log("Error inserting chat message into DB:");
				console.log(err);
				socket.disconnect();
			}
			else {
				message.msg_id = result.rows[0].msg_id;
				socket.broadcast.to(socket.room).emit("msg.new", message);
				socket.emit("msg.sent", message);

				console.log("User " + user.username + " has sent a message: " + message.msg_text + " in room: " + socket.room);
			}
		});
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