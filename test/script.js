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
	expect(1);

	var done;
	done = assert.async();
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
			//socket.emit("hw", "Hello world!");
			var testRoom = {trip_id: 1};
			socket.emit("room.join", testRoom);


			//Log out at the end
			/*
			done = assert.async();
			$.ajax({
				type: "POST",
				url: "/logout",
				complete: onAsyncComplete("Chat user logout", done)
			});*/
		},
		complete: onAsyncComplete("Chat user login", done)
	});
});

var onAsyncComplete = function(text, done) {
    return function(jqXHR, textStatus) {
    	console.log("Ran: " + text);
		QUnit.equal(jqXHR.status, 200, text);
		done();
	};
}