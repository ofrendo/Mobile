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
	function(trip_id) {
		return {
			text: "DELETE FROM trip WHERE trip_id=$1",
			values: [trip_id]
		};
	}
);