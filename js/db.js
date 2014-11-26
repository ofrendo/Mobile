var pg = require('pg');

var db = exports;

var client;
db.connect = function(callback) {
	pg.connect(process.env.DATABASE_URL, function(err, c) {
		client = c;
		if (typeof(callback) == "function") callback();
	});
}

db.createTestTable = function(callback) {
	var sql = "CREATE TABLE test (num int SERIAL, name varchar(20))";
	var query = client.query(sql);

	query.on("row", function(row) {
		console.log("Test table created.");
		if (typeof(callback) == "function") callback();
	});
};

db.insertTestTable = function (callback) {
	var sql = "INSERT INTO test (name) VALUES('Hello world!')";
	var query = client.query(sql);

	query.on("row", function(row) {
		console.log("Row inserted.");
		if (typeof(callback) == "function") callback();
	});
};

db.readTestTable = function() {
	var sql = "SELECT MAX(num) FROM test";
	var query = client.query(sql);

	query.on("row", function(row) {
		console.log("Read table.")
		console.log(row);
		if (typeof(callback) == "function") callback();
	})
};

exports.db = db;