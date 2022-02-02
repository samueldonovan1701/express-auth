//Middleware req builder
module.exports = function(req, res, next) {
	sessionID = req.signedCookies['session'];

	if(sessionID === undefined) {
		req.user = null;
		req.groups = null;
		req.session = undefined;

		next();
		return;
	}

	req.session = module.exports.sessions.get(sessionID);

	if(req.session === undefined) {
		req.user = null;
		req.groups = null;
		req.session = null;

		next();
		return;
	}

	Object.defineProperty(req, "user", { get: function() {
		return module.exports.users.get(req.session.userID);
	}});
	Object.defineProperty(req, "groups", { get: function() {
		return module.exports.groups.with(req.session.userID);
	}});

	next();
	return;
}


//Resource Managers
UserManager = require("./UserManager.js");
GroupManager = require("./GroupManager.js");
SessionManager = require("./SessionManager.js");

module.exports.users = new UserManager();
module.exports.groups = new GroupManager();
module.exports.sessions = new SessionManager();


//Authentication
//login
module.exports.login = function(req, res, username,	password)		
{
	//Input validation
	if(typeof username !== "string")
		throw new Error("express-auth.login(req, res, username, password): username is not a string");
	if(typeof password !== "string")
		throw new Error("express-auth.login(req, res, username, password): password is not a string");

	//Attempt login
	let user = module.exports.users.get(username);
	if(user === undefined)//Username not found
		return undefined;

	let login = (user.password === password);
	if(!login) //Bad password
		return false;

	//Login success

	//Create new session
	let sessionID = module.exports.sessions.new(username);

	//Try to set a secure cookie
	try {
		res.cookie("session", sessionID, {
			signed: true,
			expires: new Date(Date.now() + module.exports.sessions.maxAge),
			maxAge: module.exports.sessions.maxAge, //In ms
			httpOnly: module.exports.sessions.httpOnly,
			sameSite: module.exports.sessions.sameSite,
			secure: module.exports.sessions.secure
		});
	} catch(e) {
		if(e.message === 'cookieParser("secret") required for signed cookies')
			e.message = 'cookieParser("secret") required for signed cookies, which express-auth uses';

		throw e;
	}

	//Login successful & cookie set

	//Set req
	req.session = module.exports.sessions.get(sessionID);

	Object.defineProperty(req, "user", { get: function() {
		return module.exports.users.get(username);
	}});
	Object.defineProperty(req, "groups", { get: function() {
		return module.exports.groups.with(username);
	}});

	return true;
}
module.exports.login.endpoint = function(req, res) {
	//Input validation
	if(req.body === undefined)
		throw new Error("express-auth.login(req, res): req.body undefined, make sure to use express.json()");
	
	if(req.body.username === undefined)
		throw new Error("express-auth.login(req, res): req.body.username undefined");
	if(typeof req.body.username !== "string")
		throw new Error("express-auth.login(req, res): req.body.username is not a string");

	if(req.body.password === undefined)
		throw new Error("express-auth.login(req, res): req.body.password undefined");
	if(typeof req.body.password !== "string")
		throw new Error("express-auth.login(req, res): req.body.password is not a string");

	//Login
	let login = module.exports.login(req, res, req.body.username, req.body.password);

	//Response
	if(login === true)
		res.sendStatus(200); //OK
	else
		res.sendStatus(401); //Unauthorized

	res.end();
}
//logout
module.exports.logout = function(req, res) {
	//Input validation
	if(req.session === undefined) //No cookie
		return undefined;
	if(req.session === null) //No server-side session
		return null;

	//Clear user-side session
	res.clearCookie('session');

	//Clear server-side session
	module.exports.sessions.del(req.session.id);

	//Clear req
	req.user = null;
	req.groups = null;
	req.session = undefined;
	
	return true;
}
module.exports.logout.endpoint = function(req, res) {
	let logout = module.exports.logout(req, res);

	//Response
	if(logout === true)
		res.sendStatus(200); //OK
	else if(logout === undefined)
		res.sendStatus(406); //Not logged in
	else if(logout === null)
		res.sendStatus(409); //Conflict with server state

	res.end();
}


//Authorization
module.exports.onlyUsers = function(...users) {
	if(users.length === 0) { //onlyUsers()
		return function(req, res, next) {
			if(!req.session) { //Not logged in
				res.sendStatus(401); //Unauthorized
				res.end();
			}
			else
				next();
		};
	}
	else if(Array.isArray(users[0])) { //onlyUsers(["a","b","c"])
		users = users[0];
		return function(req, res, next) {
			if(!req.session) { //Not logged in
				res.sendStatus(401); //Unauthorized
				res.end();
			}
			else if(!users.includes(req.session.userID)) {
				res.sendStatus(403); //Forbidden
				res.end();
			}
			else
				next();
		};
	}
	else { //onlyUsers("a","b","c")
		return function(req, res, next) {
			if(!req.session) { //Not logged in
				res.sendStatus(401); //Unauthorized
				res.end();
			}
			else if(!users.includes(req.session.userID)) {
				res.sendStatus(403); //Forbidden
				res.end();
			}
			else
				next();
		};
	}
}
module.exports.onlyGroups = function(...groups) {
	if(groups.length === 0) { //onlyGroups()
		return function(req, res, next) {
			if(!req.session) { //Not logged in
				res.sendStatus(401); //Unauthorized
				res.end();
			}
			else if(req.groups.length === 0) {
				res.sendStatus(403); //Forbidden
				res.end();
			}
			else
				next();
		};
	}
	else if(Array.isArray(groups[0])) { //onlyGroups(["a","b","c"])
		groups = groups[0];
		return function(req, res, next) {
			if(!req.session) { //Not logged in
				res.sendStatus(401); //Unauthorized
				res.end();
			}
			else if(!req.groups.some(group => groups.includes(group))) {
				res.sendStatus(403); //Forbidden
				res.end();
			}
			else
				next();
		};
	}
	else { //onlyUsers("a","b","c")
		return function(req, res, next) {
			if(!req.session) { //Not logged in
				res.sendStatus(401); //Unauthorized
				res.end();
			}
			else if(!req.groups.some(group => groups.includes(group))) {
				res.sendStatus(403); //Forbidden
				res.end();
			}
			else
				next();
		};
	}
}