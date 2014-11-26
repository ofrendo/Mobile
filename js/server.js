var db = require("/db");
var express = require('express');
var app = express();

function start() {
	db.connect();

	app.get("/", function(req, res) {
		res.send("Hello world!");
	});

	app.get("/create", function(req, res){
		db.createTestTable(function () {
			res.send("Done");
		});
	});

	app.get("/insert", function(req, res){
		db.insertTestTable(function () {
			res.send("Done");
		});
	});

	app.get("/read", function(req, res){
		db.readTestTable(function () {
			res.send("Done");
		});
	});

	app.listen(process.env.PORT || 5000);
}

exports.start = start;