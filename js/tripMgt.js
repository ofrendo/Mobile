var db = require("./db");
var crud = require("./crud");

exports.crud = new crud.CRUDModule("trip",
	function(trip) {
		return {
			text: "INSERT INTO trip (name, start_date, end_date) VALUES ($1, $2, $3) RETURNING trip_id",
			values: [trip.name, trip. start_date, trip.end_date]
		};
	},
	function(trip_id) {
		return {
			text: "SELECT * FROM trip WHERE trip_id=$1",
			values: [trip_id]
		}
	},
	function(trip) {
		return {
			text: "UPDATE trip SET name=$1, start_date=$2, end_date=$3 RETURNING trip_id, name, created_on, start_date, end_date",
			values: [trip.name, trip.start_date, trip.end_date]
		};
	},
	function(trip_id, req) {
		return [{
			text: "DELETE FROM user_trip WHERE user_id=$1 AND trip_id=$2",
			values: [req.session.user.user_id, trip_id]
		},
		{
			text: "DELETE FROM trip WHERE trip_id=$1",
			values: [trip_id]
		}];
	}
);

exports.crud.beforeSendCreate = function(req, res, trip) {
	var sql = {
		text: "INSERT INTO user_trip (user_id, trip_id) VALUES ($1, $2)",
		values: [req.session.user.user_id, trip.trip_id]
	};
	db.query(sql);
}

exports.crud.onCertainTrip = function(req, res, next) {
	//Check if user is allowed to read/update/delete trip
	var sql = {
		text: "SELECT * FROM user_trip WHERE user_id=$1 AND trip_id=$2",
		values: [req.session.user.user_id, req.params["trip_id"]]
	}
	db.query(sql, function(err, result) {
		if (err) {
			console.log("Error operating on certain trip:");
			console.log(err);
			res.status(500).end();
		}
		else {
			if (result.rows.length === 1) {
				next();	
			}
			else {
				console.log("User tried to retrieve forbidden trip:");
				console.log(sql.values);
				res.status(403).end();
			}	
		}
	})
	
};

exports.crud.onReadUserTrips = function(req, res) {
	var sql = {
		text: "SELECT * FROM user_trip, trip" + 
			  " WHERE user_trip.user_id=$1" + 
			  "   AND user_trip.trip_id = trip.trip_id",
		values: [req.session.user.user_id] 
	};
	db.query(sql, function(err, result) {
		if (err) {
			console.log("Error reading user trips:");
			console.log(err);
			res.status(500).end();
		}
		else {
			res.status(200).send(result.rows);
		}
	});
}