'use strict';

var crypto = require('crypto');

class TokenManager {
	#tokens;
	#model;
	constructor(model = {}, maxAge=3600, purgeInterval=3600) {
		this.#tokens = {};
		this.#model = model;

		this.purgeInterval = purgeInterval;
		this.startPeriodicPurging();

		this.maxAge = maxAge;
		this.httpOnly = true;
		this.sameSite = true;
		this.secure = true;
	}

//Create
	new(userId, maxAge=this.maxAge) {
		let tokenId = crypto.createHash('md5')
			.update(userId)
			.update(Date.now().toString())
			.digest('hex');

		this.#tokens[tokenId] = { 
			user: userId,
			expires: Math.floor(Date.now()/1000 + maxAge),
			model: this.#model
		};
		return tokenId;
	}

//Read
	get(id) {
		let token = this.#tokens[id];

		if(token == undefined)
			return undefined;
		else
			return token;
	}
	getExpires(id) {
		let token = this.#tokens[id];

		if(token == undefined)
			return undefined;
		else
			return token.expires;
	}
	getUser(id) {
		let token = this.#tokens[id];

		if(token == undefined)
			return undefined;
		else
			return token.user;
	}
	getModel(id) {
		let token = this.#tokens[id];

		if(token == undefined)
			return undefined;
		else
			return token.model;
	}
	all() {
		return Object.keys(this.#tokens);
	}

//Update
	setExpires(id, expires) {
		let token = this.#tokens[id];

		if(token == undefined)
			return undefined;
		else {
			token.expires = expires;
			return true;
		}
	}
	setModel(id, model) {
		let token = this.#tokens[id];

		if(token == undefined)
			return undefined;
		else {
			token.model = model;
			return true;
		}
	}

//Delete
	del(id) {
		if(!(id in this.#tokens))
			return false;

		delete this.#tokens[id];
		return true;
	}
	
	#purging;
	purge() {
		const now = Date.now();
		for (const [id, token] of Object.entries(this.#tokens)) {
			if(token.expires < now)
				delete this.#tokens[id];
		}
	}
	startPeriodicPurging() {
		this.#purging = true;
	}
	stopPeriodicPurging() {
		this.#purging = false;
	}
	#periodicPurge() {
		this.purge();
		if(this.#purging)
			setTimeout(this.#periodicPurge.bind(this), this.purgeInterval*1000);
	}
};

module.exports = TokenManager;