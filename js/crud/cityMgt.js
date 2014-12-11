var crud = require("./crud");
var tripMgt = require("./tripMgt");

exports.crud = new crud.CRUDModule("city", 
	function(city) {
		return {
			text: "INSERT INTO city" +
				  " (trip_id, name, place_id, longitude, latitude, start_date, end_date, ranking)" + 
				  " VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING city_id",
			values: [city.trip_id, city.name, city.place_id, city.longitude, city.latitude, city.start_date, city.end_date, city.ranking]
		};
	},
	function(city_id) {
		return {
			text: "SELECT * FROM city WHERE city_id=$1",
			values: [city_id]
		};
	},
	function(city) {
		return {
			text: "UPDATE city SET" +
				  " trip_id=$1, name=$2, place_id=$3, longitude=$4, latitude=$5, start_date=$6, end_date=$7, ranking=$8" +
				  " WHERE city_id=$9" +
				  " RETURNING city_id, trip_id, name, place_id, longitude, latitude, start_date, end_date, ranking",
			values: [city.trip_id, city.name, city.place_id, city.longitude, city.latitude, city.start_date, city.end_date, city.ranking, city.city_id]
		};
	},
	function(city_id) {
		return {
			text: "DELETE FROM city WHERE city_id=$1",
			values: [city_id]
		};
	}
);

exports.crud.onAll = function(req, res, next) {
	var trip_id = req.params.trip_id;
	var city_id = req.params.city_id;
	if (isNaN(trip_id) || isNaN(city_id)) {
		res.status(400).end();
		return;
	}

	tripMgt.isUserAllowed(req.session.user.user_id, trip_id, function(result, status) {
		if (result === false) {
			res.status(status).end();
		}
		else {
			next();
		}
	});
};