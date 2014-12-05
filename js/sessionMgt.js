var sessionMgt = exports;

exports.setUser = function(req, user) {
	delete user["password"];
	req.session.user = user;
}

exports.onCheckSession = function(req, res, next) {
	if (sessionMgt.isLoggedIn(req)) {
		next();			
	}	
	else {
		res.status(401).send(JSON.stringify({message: "Not logged in."}));
	}
}

exports.isLoggedIn = function(req) {
	return !!req.session.user;
}

exports.doLogout = function(req) {
	delete req.session["user"];
}

exports.sessionMgt = sessionMgt;