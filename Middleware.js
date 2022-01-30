
//router.use(auth.onlyGroup())
//router.use(auth.onlyGroups([str, str,...]))
//router.use(auth.onlyGroups(regex))

class Middleware {
	constructor(auth) {
		this.auth = auth;
	}

	onlyUsers(...userIDs) {
		if(userIDs.length == 0) { //onlyUsers()
			return (req, res, next) => {
					let user = this.auth.getCurrentUser(req, res);

					if(!user) { //Not logged in
						res.status(401);
						res.end();
					}

					next();
			};
		}
		else if(userIDs[0] instanceof Array) { //onlyUsers(["a", "b",...])
			
			userIDs = userIDs[0];
			
			return (req, res, next) => {
				let user = this.auth.getCurrentUser(req, res);
				
				let contains = (user in userIDs);
				
				if(!contains) {
					if(user) { //Logged in, forbidden
						res.status(403);
						res.end();
					}
					else { //Not logged in
						res.status(401);
						res.end();
					}
				}
				
				next();
			};
		}
		else if(userIDs[0] instanceof RegExp){ //onlyUsers(/ab+c/i)
			
			let regex = userIDs[0];
			return (req, res, next) => {
				let user = this.auth.getCurrentUser(req, res);

				let contains = regex.match(user);

				if(!contains) {
					if(user) { //Logged in, forbidden
						res.status(403);
						res.end();
					}
					else { //Not logged in
						res.status(401);
						res.end();
					}
				}

				next();
			};
		}
		else if(typeof userIDs[0] == "string") { //onlyUsers("a", "b",...)
			return (req, res, next) => {
				let user = this.auth.getCurrentUser(req, res);
				
				let contains = (user in userIDs);

				if(!contains) {
					if(user) { //Logged in, forbidden
						res.status(403);
						res.end();
					}
					else { //Not logged in
						res.status(401);
						res.end();
					}
				}
				
				next();
			};
		}
		else {
			throw new Error("onlyUsers(): Unexpected argument '"+userIDs[0]+"'");
		}
	}


	onlyGroups(...groupIDs) {
		if(groupIDs[0] instanceof Array) { //onlyGroups(["a", "b",...])
			
			let groupIDs = groupIDs[0];

			return (req, res, next) => {
				let user = this.auth.getCurrentUser(req, res);
				let userGroups = this.auth.getCurrentUserGroups(req, res);

				let contains = userGroups.some(id => groupIDs.includes(id) != -1);

				if(!contains) {
					if(user) { //Logged in, forbidden
						res.status(403);
						res.end();
					}
					else {
						res.status(401);
						res.end();
					}
				}

				next();
			};
		}
		else if(groupIDs[0] instanceof RegExp){ //onlyGroups(/ab+c/i)
			
			let regex = groupIDs;

			return (req, res, next) => {
				let user = this.auth.getCurrentUser(req, res);
				let userGroups = this.auth.getCurrentUserGroups(req, res);

				let contains = userGroups.some(id => regex.match(id));

				if(!contains) {
					if(user) { //Logged in, forbidden
						res.status(403);
						res.end();
					}
					else {
						res.status(401);
						res.end();
					}
				}

				next();
			};
		}
		else if(typeof groupIDs[0] == "string") { //onlyGroups("a", "b",...)
			return (req, res, next) => {
				let user = this.auth.getCurrentUser(req, res);
				let userGroups = this.auth.getCurrentUserGroups(req, res);

				let contains = userGroups.some(id => groupIDs.includes(id) != -1);

				if(!contains) {
					if(user) { //Logged in, forbidden
						res.status(403);
						res.end();
					}
					else {
						res.status(401);
						res.end();
					}
				}

				next();
			};
		}
		else {
			throw new Error("onlyUsers(): Unexpected argument '"+groupIDs[0]+"'");
		}
	}
};

module.exports = Middleware;