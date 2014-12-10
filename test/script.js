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
		url: "/auth/logout",
		complete: onAsyncComplete("User logout", done)
	});
	
	done = assert.async();
	$.ajax({
		type: "POST",
		url: "/auth/login",
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
		url: "/auth/logout",
		complete: onAsyncComplete("User logout", done)
	});
});

//var counter = 7;
//function done() { --counter || QUnit.start() };



var testUser = {
	username: "test_user",
	password: "un1tt3st1ng"
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
		url: "/auth/login",
		data: {
			username: testUser.username,
			password: testUser.password
		},
		success: function(data, textStatus, jqXHR) {
			var socket = io.connect({ 
				reconnection: false
			});

			socket.on("room.previousMessages", function(previousMessages) {
				console.log("Chat room joined with previousMessages:");
				console.log(previousMessages);
				assert.ok(previousMessages instanceof Array, "Chat room joined");
				doneRoomJoin();

				//Send a message
				var message = {msg_text: "Unit testing chat."};
				socket.emit("msg.send", message);
			});
			socket.on("msg.sent", function() {
				console.log("Chat message sent and recieved");
				assert.ok(true, "Chat message sent and recieved");
				doneMessageSent();
				
				//Leave the room and disconnect
				socket.emit("room.leave");
			});
			socket.on("room.left", function() {
				console.log("Chat room left");
				assert.ok(true, "Chat room left");
				doneRoomLeave();

				socket.disconnect();

				//Logout at the end
				$.ajax({
					type: "POST",
					url: "/auth/logout",
					complete: onAsyncComplete("Test user logout", doneLogout)
				});
			});

			socket.on("connect", function() {
				assert.ok(true, "Connected to backend");
				doneConnect();

				//Join a room
				var testRoom = {trip_id: 1};
				socket.emit("room.join", testRoom);
			});

		},
		complete: onAsyncComplete("Test user login", doneLogin)
	});
});

var sampleTrip = {
	name: "Test trip",
	start_date: (new Date()).toISOString()
};
var updatedSampleTrip = JSON.parse(JSON.stringify(sampleTrip));
updatedSampleTrip.name = "Updated test trip";

QUnit.test("Trip tests", function(assert) {
	assert.expect(11);

	var done;
	done = assert.async();
	$.ajax({
		type: "POST",
		url: "/auth/login",
		data: {
			username: testUser.username,
			password: testUser.password
		},
		success: function(data) {
			testUser.user_id = data.user_id;
		},
		complete: onAsyncComplete("Test user login", done)
	});

	done = assert.async();
	$.ajax({
		type: "POST",
		url: "/trip",
		data: {trip: sampleTrip},
		success: function(data, textStatus, jqXHR) { //data will be trip_id
			assert.ok(data.trip_id >= 0, "Created trip_id should be an integer: " + data.trip_id);
			sampleTrip.trip_id = data.trip_id;
			updatedSampleTrip.trip_id = data.trip_id;
		},
		complete: onAsyncComplete("Trip create", done)
	});

	done = assert.async();
	$.ajax({
		type: "PUT",
		url: "/trip/" + updatedSampleTrip.trip_id,
		data: {trip: updatedSampleTrip},
		success: function(data, textStatus, jqXHR) {
			assert.ok(data.name == updatedSampleTrip.name, "trip.name should be updated");
			sampleTrip.name = data.name;
		},
		complete: onAsyncComplete("Trip update", done)
	});

	done = assert.async();
	$.ajax({
		type: "GET",
		url: "/trip/" + sampleTrip.trip_id,
		success: function(data, textStatus, jqXHR) {
			var updated = sampleTrip.name == data.name;
			assert.ok(updated, "GET should return the same data");
		},
		complete: onAsyncComplete("Trip get", done)
	});

	done = assert.async();
	$.ajax({
		type: "GET",
		url: "/user/" + testUser.user_id + "/trips",
		success: function(data, textStatus, jqXHR) {
			assert.ok(data.length >= 1, "Should return an array of trips")
		},
		complete: onAsyncComplete("Trip get all for user", done)
	});

	done = assert.async();
	$.ajax({
		type: "DELETE",
		url: "/trip/" + sampleTrip.trip_id,
		complete: onAsyncComplete("Trip delete", done)
	});

	done = assert.async();
	$.ajax({
		type: "POST",
		url: "/auth/logout",
		complete: onAsyncComplete("Test user logout", done)
	});

});

var onAsyncComplete = function(text, done) {
    return function(jqXHR, textStatus) {
    	console.log("Ran: " + text);
		QUnit.equal(jqXHR.status, 200, text);
		done();
	};
}