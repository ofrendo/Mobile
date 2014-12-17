var crud = require("./crud");
var tripMgt = require("./tripMgt");

exports.crud = new crud.CRUDModule("location", 
	function(location) {
		return {
			text: "INSERT INTO location" +
				  " (city_id, name, place_id, category, longitude, latitude, start_date, end_date, ranking)" +
				  " VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING location_id",
			values: [location.city_id, location.name, location.place_id, location.category, location.longitude,
					 location.latitude, location.start_date, location.end_date, location.ranking]
		};
	},
	function(location_id) {
		return {
			text: "SELECT * FROM location WHERE location_id=$1",
			values: [location_id]
		};
	},
	function(location) {
		return {
			text: "UPDATE location SET" +
				  " city_id=$1, name=$2, place_id=$3, category=$4, longitude=$5, latitude=$6, start_date=$7, end_date=$8, ranking=$9" + 
				  " WHERE location_id=$10" +
				  " RETURNING location_id, city_id, name, place_id, category, longitude, latitude, start_date, end_date, ranking",
			values: [location.city_id, location.name, location.place_id, location.category, location.longitude,
					 location.latitude, location.start_date, location.end_date, location.ranking,
					 location.location_id]
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
}