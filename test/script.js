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

QUnit.asyncTest("User tests", function() {
	expect(7);

	$.ajax({
		type: "POST",
		url: "/user",
		data: {user: sampleUser},
		complete: onAsyncComplete("User create")
	});

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
		complete: onAsyncComplete("User login")
	});

	$.ajax({
		type: "GET",
		url: "/user/" + sampleUser.user_id,
		complete: onAsyncComplete("User get info")
	});

	$.ajax({
		type: "PUT",
		url: "/user/" + sampleUser.user_id,
		data: {user: updatedSampleUser},
		success: function(data, textStatus, jqXHR) {
			QUnit.equal(data.email, updatedSampleUser.email, "Email should be updated");
			sampleUser = data;
		},
		complete: onAsyncComplete("User update info")
	})

	$.ajax({
		type: "DELETE",
		url: "/user/" + sampleUser.user_id,
		complete: onAsyncComplete("User delete")
	});
	
	$.ajax({
		type: "POST",
		url: "/logout",
		complete: onAsyncComplete("User logout")
	});
});

var counter = 6;
function done() { --counter || start() };

var onAsyncComplete = function(text) {
    return function(jqXHR, textStatus) {
    	console.log("Ran: " + text);
		QUnit.equal(jqXHR.status, 200, text);
		done();
	};
}