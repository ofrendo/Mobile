var db = require("./db");

var tripMgt = exports;

tripMgt.createTrip = function(trip, callback) {
	var sql = {
		text: "INSERT INTO trip (name, start_date, end_date) VALUES ($1, $2, $3) RETURNING trip_id",
		values: [trip.name, trip. start_date, trip.end_date]
	};
	db.query(sql, callback);
}

tripMgt.getTrip = function(trip_id, callback) {
	var sql = {
		text: "SELECT * FROM trip WHERE trip_id=$1",
		values: [trip_id]
	};
	db.query(sql, callback);
}

tripMgt.updateTrip = function(trip, callback) {
	var sql = {
		text: "UPDATE trip SET name=$1, start_date=$2, end_date=$3",
		values: [trip.name, trip.start_date, trip.end_date]
	};
	db.query(sql, callback);
}

tripMgt.deleteTrip = function(trip_id, callback) {
	var sql = {
		text: "DELETE FROM trip WHERE trip_id=$1",
		values: [trip_id]
	};
	db.query(sql, callback);
}

tripMgt.onCreateTrip = function(req, res) {
	tripMgt.createTrip(req.body.trip, function(err, result) {
		if (err) {
			res.status(500).send("");
			console.log("Error during create trip:");
			console.log(err);
		}
		else {
			var trip = req.body.trip;
			trip.trip_id = result.rows[0];
			res.send(trip);
		}
	})
}


exports.tripMgt = tripMgt;