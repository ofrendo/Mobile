var crud = require("./crud");
var tripMgt = require("./tripMgt");

exports.crud = new crud.CRUDModule("location", 
	function(location, req) {
		return {
			text: "INSERT INTO location" +
				  " (city_id, name, place_id, category, longitude, latitude, start_date, end_date, index)" +
				  " VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING location_id",
			values: [req.params.city_id, location.name, location.place_id, location.category, location.longitude,
					 location.latitude, location.start_date, location.end_date, location.index]
		};
	},
	function(location_id) {
		return {
			text: "SELECT * FROM location WHERE location_id=$1",
			values: [location_id]
		};
	},
	function(location, req) {
		return {
			text: "UPDATE location SET" +
				  " name=$1, place_id=$2, category=$3, longitude=$4, latitude=$5, start_date=$6, end_date=$7, index=$8" + 
				  " WHERE location_id=$9" +
				  " RETURNING *",
			values: [location.name, location.place_id, location.category, location.longitude,
					 location.latitude, location.start_date, location.end_date, location.index,
					 req.params.location_id]
		};
	},
	function(location_id) {
		return {
			text: "DELETE FROM location WHERE location_id=$1",
			values: [location_id]
		};
	}
);

exports.crud.onAll = function(req, res, next) {
	var location_id = req.params.location_id;
	if (isNaN(location_id)) {
		res.status(400).end();
		return;
	}

	next();
}