'use strict';

var crypto = require('crypto');

class TokenManager {
	constructor(model = {}, maxAge=3600000, purgeInterval=3600000) {
		this._tokens = {};
		this._model = model;

		this.purgeInterval = purgeInterval;
		this._periodicPurge();	

		this.maxAge = maxAge;
		this.httpOnly = true;
		this.sameSite = true;
		this.secure = true;
	}

//Create
	new(userId, model=this._model, maxAge=this.maxAge) {
		let tokenId = crypto.createHash('md5')
			.update(userId)
			.update(Date.now().toString())
			.digest('hex');

		this._tokens[tokenId] = { 
			user: userId,
			expires: Date.now() + maxAge,
			model: model
		};
		return tokenId;
	}

//Read
	get(id) {
		let token = this._tokens[id];

		if(token == undefined)
			return undefined;
		else
			return token;
	}
	getExpires(id) {
		let token = this._tokens[id];

		if(token == undefined)
			return undefined;
		else
			return token.expires;
	}
	getUser(id) {
		let token = this._tokens[id];

		if(token == undefined)
			return undefined;
		else
			return token.user;
	}
	getModel(id) {
		let token = this._tokens[id];

		if(token == undefined)
			return undefined;
		else
			return token.model;
	}
	all() {
		return Object.keys(this._tokens);
	}

//Update
	setExpires(id, expires) {
		let token = this._tokens[id];

		if(token == undefined)
			return undefined;
		else {
			token.expires = expires;
			return true;
		}
	}
	setModel(id, model) {
		let token = this._tokens[id];

		if(token == undefined)
			return undefined;
		else {
			token.model = model;
			return true;
		}
	}

//Delete
	del(id) {
		if(!(id in this._tokens))
			return false;

		delete this._tokens[id];
		return true;
	}
	purge() {
		const now = Date.now();
		for (const [id, token] of Object.entries(this._tokens)) {
			if(token.expires < now)
				delete this._tokens[id];
		}
	}
	_periodicPurge() {
		this.purge();
		setTimeout(this._periodicPurge.bind(this), this.purgeInterval);
	}
};

module.exports = TokenManager;