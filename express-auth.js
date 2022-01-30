var cookieParser = require('cookie-parser');

UserManager = require("./UserManager.js");
GroupManager = require("./GroupManager.js");
TokenManager = require("./TokenManager.js");
AuthManager = require("./AuthManager.js");
Middleware = require("./Middleware.js");

var auth = new AuthManager(
		new UserManager(),
		new GroupManager(),
		new TokenManager()
	);

var middleware = new Middleware(auth);

module.exports = {
	...auth,
	...middleware
}; 