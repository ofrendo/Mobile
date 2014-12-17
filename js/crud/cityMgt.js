var db = require(".././db");
var crud = require("./crud");
var tripMgt = require("./tripMgt");

exports.crud = new crud.CRUDModule("city", 
	function(city, req) {
		return {
			text: "INSERT INTO city" +
				  " (trip_id, name, place_id, longitude, latitude, start_date, end_date, ranking)" + 
				  " VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING city_id",
			values: [req.params.trip_id, city.name, city.place_id, city.longitude, city.latitude, city.start_date, city.end_date, city.ranking]
		};
	},
	function(city_id) {
		return {
			text: "SELECT * FROM city WHERE city_id=$1",
			values: [city_id]
		};
	},
	function(city, req) {
		return {
			text: "UPDATE city SET" +
				  " name=$1, place_id=$2, longitude=$3, latitude=$4, start_date=$5, end_date=$6, ranking=$7" +
				  " WHERE city_id=$8" +
				  " RETURNING city_id, trip_id, name, place_id, longitude, latitude, start_date, end_date, ranking",
			values: [city.name, city.place_id, city.longitude, city.latitude, city.start_date, city.end_date, city.ranking, req.params.city_id]
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
	var city_id = req.params.city_id;
	if (isNaN(city_id)) {
		res.status(400).end();
		return;
	}

	next();
};

exports.crud.onReadCityLocations = function(req, res) {
	var city_id = req.params.city_id;
	var sql = {
		text: "SELECT * FROM city, location" +
			  " WHERE city.city_id=$1" + 
			  "   AND city.city_id=location.city_id",
		values: [city_id]
	};
	db.query(sql, function(err, result) {
		if (err) {
			console.log("Error reading city locations: city_id=" + city_id);
			console.log(err);
			res.status(500).end();
		}
		else {
			res.status(200).send(result.rows);
		}
	})
}