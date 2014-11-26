var pg = require('pg');

var db = exports;

var client;
db.connect = function(callback) {
	pg.connect(process.env.DATABASE_URL, function(err, c) {
		client = c;
		callback();
	});
}

db.createTestTable = function(callback) {
	var sql = "CREATE TABLE test (num int auto_increment not null, name varchar(20))";
	var query = client.query(sql);

	query.on("row", function(row) {
		console.log("Test table created.");
		callback();
	});
};

db.insertTestTable = function (callback) {
	var sql = "INSERT INTO test (name) VALUES('Hello world!')";
	var query = client.query(sql);

	query.on("row", function(row) {
		console.log("Row inserted.");
		callback();
	});
};

db.readTestTable = function() {
	var sql = "SELECT MAX(num) FROM test";
	var query = client.query(sql);

	query.on("row", function(row) {
		console.log("Read table.")
		console.log(row);
		callback(JSON.stringify(row));
	})
};

exports.db = db;