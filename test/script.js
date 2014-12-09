//User tests
var sampleUser = {
	email: "hello@wor.ld",
	username: "helloWorld",
	password: "helloPass",
	name: "Hello World"
};
var updatedSampleUser = JSON.parse(JSON.stringify(sampleUser));
updatedSampleUser.email = "updated@email.de";

$.ajaxSetup({
	async: false
});

QUnit.test("User tests", function(assert) {
	assert.expect(8);

	var done;
	done = assert.async();
	$.ajax({
		type: "POST",
		url: "/user",
		data: {user: sampleUser},
		complete: onAsyncComplete("User create", done)
	});

	done = assert.async();
	$.ajax({
		type: "POST",
		url: "/logout",
		complete: onAsyncComplete("User logout", done)
	});
	
	done = assert.async();
	$.ajax({
		type: "POST",
		url: "/login",
		data: {
			username: sampleUser.username,
			password: sampleUser.password
		},
		success: function(data, textStatus, jqXHR) {
			sampleUser.user_id = data.user_id;
			updatedSampleUser.user_id = data.user_id;
		},
		complete: onAsyncComplete("User login", done)
	});

	done = assert.async();
	$.ajax({
		type: "GET",
		url: "/user/" + sampleUser.user_id,
		complete: onAsyncComplete("User get info", done)
	});

	done = assert.async();
	$.ajax({
		type: "PUT",
		url: "/user/" + sampleUser.user_id,
		data: {user: updatedSampleUser},
		success: function(data, textStatus, jqXHR) {
			QUnit.equal(data.email, updatedSampleUser.email, "Email should be updated");
			sampleUser = data;
		},
		complete: onAsyncComplete("User update info", done)
	})

	done = assert.async();
	$.ajax({
		type: "DELETE",
		url: "/user/" + sampleUser.user_id,
		complete: onAsyncComplete("User delete", done)
	});
	
	done = assert.async();
	$.ajax({
		type: "POST",
		url: "/logout",
		complete: onAsyncComplete("User logout", done)
	});
});

//var counter = 7;
//function done() { --counter || QUnit.start() };



var chatUser = {
	username: "chat_user",
	password: "chat"
};

QUnit.test("Chat tests", function(assert) {
	assert.expect(6);

	var doneLogin = assert.async();
	var doneConnect = assert.async();
	var doneRoomJoin = assert.async();
	var doneMessageSent = assert.async();
	var doneRoomLeave = assert.async();
	var doneLogout = assert.async();

	$.ajax({
		type: "POST",
		url: "/login",
		data: {
			username: chatUser.username,
			password: chatUser.password
		},
		success: function(data, textStatus, jqXHR) {
			var socket = io.connect("http://localhost:5000", { 
				reconnection: false
			});

			socket.on("room.previousMessages", function(previousMessages) {
				console.log("Chat room joined");
				assert.ok(true, "Chat room joined");
				doneRoomJoin();
			});
			socket.on("msg.sent", function() {
				console.log("Chat message sent and recieved");
				assert.ok(true, "Chat message sent and recieved");
				doneMessageSent();
			});
			socket.on("room.left", function() {
				console.log("Chat room left");
				assert.ok(true, "Chat room left");
				doneRoomLeave();

				socket.disconnect();
				//Log out at the end
				$.ajax({
					type: "POST",
					url: "/logout",
					complete: onAsyncComplete("Chat user logout", doneLogout)
				});
			});

			socket.on("connect", function() {
				assert.ok(true, "Connected to backend");
				doneConnect();

				//Join a room
				var testRoom = {trip_id: 1};
				socket.emit("room.join", testRoom);

				//Send a message
				var message = {msg_text: "Unit testing chat."};
				socket.emit("msg.send", message);

				//Leave the room and disconnect
				socket.emit("room.leave");
			});

		},
		complete: onAsyncComplete("Chat user login", doneLogin)
	});
});

var onAsyncComplete = function(text, done) {
    return function(jqXHR, textStatus) {
    	console.log("Ran: " + text);
		QUnit.equal(jqXHR.status, 200, text);
		done();
	};
}