var db = require("./db");

exports.CRUDModule = function(objectName, getSqlCreate, getSqlRead, getSqlUpdate, getSqlDelete) {
	var self = this;
	this.objectName = objectName;
	this.objectIDName = objectName + "_id";

	function doCreate(object, callback) {
		doQuery(getSqlCreate(object), callback);
	}	
	function doRead(object_id, callback) {
		doQuery(getSqlRead(object_id), callback);
	}
	function doUpdate(object, callback) {
		doQuery(getSqlUpdate(object), callback);
	}
	function doDelete(object_id, callback) {
		doQuery(getSqlDelete(object_id), callback);
	}

	function doQuery(sql, callback) {
		db.query(sql, callback);
	}

	//Creates an object in the database and sends back the ID it was created with
	this.onCreate = function(req, res) {
		doCreate(req.body[self.objectName], function(err, result) {
			if (err) {
				res.status(500).send(JSON.stringify({message: "Error during " + self.objectName + " creation."}));
				console.log("Error during " + self.objectName + " creation:");
				console.log(err);
			}
			else {
				console.log("Created " + self.objectName + ":");
				console.log(result.rows[0]);
				var object = req.body[self.objectName];
				object[self.objectIDName] = result.rows[0][self.objectIDName];
				
				if (typeof(self.beforeSendCreate) == "function") self.beforeSendCreate(req, res, object); 
				
				var result = {};
				result[self.objectIDName] = object[self.objectIDName];
				res.status(200).send(result);
			}
		});
	}
	this.onRead = function(req, res) {
		doRead(req.params[self.objectIDName], function(err, result) {
			if (result.rows.length === 1) {
				var object = result.rows[0];
				
				if (typeof(self.beforeSendRead) == "function") self.beforeSendRead(req, res, object); 

				res.status(200).send(object);
			}
			else {
				res.status(404).end();
			}
		});
	}
	this.onUpdate = function(req, res) {
		if (typeof(self.beforeSQLCheckUpdate == "function")) {
			if (self.beforeSQLCheckUpdate(req, res, req.body[objectName]) == false) {
				res.status(403).send({message: "Forbidden"});
				return;
			}
		}
		doUpdate(req.body[self.objectName], function(err, result) {
			if (err) {
				res.status(500).send(JSON.stringify({message: "Error during " + self.objectName + " update."}));
				console.log("Error during " + self.objectName + " update:");
				console.log(err);
			}
			else {
				var object = result.rows[0];

				if (typeof(self.beforeSendUpdate) == "function") self.beforeSendUpdate(req, res, object); 

				res.send(object);				
			}
		});
	}
	this.onDelete = function(req, res) {
		doDelete(req.params[self.objectIDName], function(err, result) {
			if (err || result.rowCount !== 1) {
				res.status(500).send(JSON.stringify({message: "Error during " + self.objectName + " delete."}));
				console.log("Error during " + self.objectName + " delete:");
				console.log(err);
			}
			else {
				if (result.rowCount === 1) {
					console.log("Deleted " + self.objectName);
					if (typeof(self.beforeSendDelete) == "function") self.beforeSendDelete(req, res); 
					res.status(200).end();
				}
			}
		});
	}
}