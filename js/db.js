var pg = require('pg');

var db = exports;

var query = function(text, values, cb) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query(text, function(err, result) {
			done();
			cb(err, result);
		})
	});
}

db.createTestTable = function(callback) {
	query("CREATE TABLE test (num SERIAL, name varchar(20))", function(error, result) {
		console.log("Test table created.");
		callback();
	});
};

db.insertTestTable = function (callback) {
	query("INSERT INTO test (name) VALUES('Hello world!')", function(error, result) {
		console.log("Inserted.");
		callback();
	});
};

db.readTestTable = function(callback) {
	query("SELECT MAX(num) FROM test", function(error, result) {
		console.log("Read.");
		callback(JSON.stringify(result));
	});
}	

/*var client;
db.connect = function(callback) {
	pg.connect(process.env.DATABASE_URL, function(err, c) {
		client = c;
		if (typeof(callback) == "function") callback();
	});
}


db.createTestTable = function(callback) {
	var sql = "CREATE TABLE test (num SERIAL, name varchar(20))";
	var query = client.query(sql);

	query.on("row", function(row) {
		console.log("Test table created.");
		callback();
	});
};

db.insertTestTable = function (callback) {
	var sql = "INSERT INTO test (name) VALUES('Hello world!')";
	var query = client.query(sql);

	//This gives a timeout
	query.on("row", function(row) {
		console.log("Row inserted.");
		callback();
	});
};

db.readTestTable = function(callback) {
	var sql = "SELECT MAX(num) FROM test";
	var query = client.query(sql);

	//This works
	query.on("row", function(row) {
		console.log("Read table.")
		console.log(row);
		callback(JSON.stringify(row));
	})
};*/

exports.db = db;