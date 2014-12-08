var db = require("./db");


exports.start = function(io) {
	io.on("connection", onConnect);
}

var currentUsers = [];
var onConnect = function(socket) {
	var userAdded = false;
	socket.on("user.add", function(userData) {
		userAdded = true;
		currentUsers.push(userData.username);
		socket.broadcast.emit("user.joined", currentUsers);
	});

	socket.on("message", function(message) {

	});

	socket.on("disconnect", function() {

	})
}

function onAddUser(socket) {
	return function(userData) {
		
	}
}

var onMessage = function(data) {

}