var crypto = require("crypto");

exports.hashPassword = function(string) {
	return crypto.createHash('md5').update(string).digest('hex');
}