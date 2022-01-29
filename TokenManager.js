'use strict';

var crypto = require('crypto');

class TokenManager {
	constructor(model = {}) {
		this._tokens = {};
		this._model = model;

		this.purgeInterval = 3600;

		this.maxAge = 3600;
		this.httpOnly = true;
		this.sameSite = true;
		this.secure = true;
	}

//Create
	new(userId, model=this._model) {
		if(id in this._tokens)
			return false;

		let tokenId = crypto.createHash('md5')
			.update(userId)
			.update(Date.now().toString());
			.digest('hex');

		this._tokens[tokenId] = { 
			user: userId,
			expires: Date.now() + this.maxAge*1000,
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
};

module.exports = TokenManager;