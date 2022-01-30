'use strict';
/* Injected Dependencies:

userManager:
	{bool} verifyPW(userID, pw)

groupManager:
	.

tokenManager:
	{int} maxAge
	{bool} httpOnly
	{bool} sameSite
	{bool} secure

	{string} new(userId, maxAge)
	{bool} del(tokenId)
	{string} getUser(tokenId)
*/


class AuthManager {
	constructor(userManager, groupManager, tokenManager) {
	 	//Managers
	 		this.users = userManager;
	 		this.groups = groupManager;
	 		this.tokens = tokenManager;
	}

	use(userManager=undefined, groupManager=undefined, tokenManager=undefined) {
		if(userManager != undefined) {
			delete this.users;
			this.users = userManager;
		}
		if(groupManager != undefined) {
			delete this.groups;
			this.groups = groupManager;
		}
		if(tokenManager != undefined) {
			delete this.tokens;
			this.tokens = tokenManager;
		}
	}

//Methods
	login(req, res, userID, pw) {
		if(req.signedCookies['session'] != undefined)
			return 409; //Cookie exists; Already logged in

		let login = this.users.verifyPW(userID, pw);
		if(!login)
			return login; //Login failed

		let tokenId = this.tokens.new(userId);
		if(!tokenId)
			return 500;

		res.signedCookie('session', token, {
			expires: new Date(Date.now() + this.tokens.maxAge*1000),
			maxAge: this.tokens.maxAge, //In seconds
			httpOnly: this.tokens.httpOnly,
			sameSite: this.tokens.sameSite,
			secure: this.tokens.secure
		});
	}

	logout(req, res) {
		let tokenId = req.signedCookies['session'];

		if(tokenId == undefined)
			return 409; //Cookie dne; Not logged in

		let logout = this.tokens.del(token);
		if(!logout)
			return logout;

		res.clearCookie('session');
	}

	isLoggedIn(req, res) {
		return this.getCurrentUser(req, res) != false;
	}

	getCurrentUser(req, res) {
		return this.tokens.getUser(req.signedCookies['session']);
	}
	getCurrentUserGroups(req, res) {
		let userID = this.getCurrentUser(req, res);
		return this.groups.getUserGroups(userID);
	}
};

module.exports = AuthManager;