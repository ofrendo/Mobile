exports.setUser = function(req, user) {
	delete user["password"];
	req.session.user = user;
}

exports.isLoggedIn = function(req) {
	return !!req.session.user;
}

exports.doLogout = function(req) {
	delete req.session["user"];
}