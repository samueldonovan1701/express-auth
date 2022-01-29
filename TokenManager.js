'use strict';

var crypto = require('crypto');

class TokenManager {
	constructor() {
		this._tokens = {};

		this.purgeInterval = 3600;

		this.maxAge = 3600;
		this.httpOnly = true;
		this.sameSite = true;
		this.secure = true;
	}

//Methods
	new(userId) {
		if(id in this._tokens)
			return false;

		let tokenId = crypto.createHash('md5')
			.update(userId)
			.update(Date.now().toString());
			.digest('hex');

		this._tokens[tokenId] = { 
			user: userId,
			expires: Date.now() + this.maxAge*1000
		};
		return tokenId;
	}
	del(id) {
		if(!(id in this._tokens))
			return false;

		delete this._tokens[id];
		return true;
	}
	all() {
		return this._tokens.keys();
	}

	setExpires(id, expires) {
		if(!(id in this._tokens))
			return false;

		this._tokens[tokenId].expires = expires
		return true;
	}
};

module.exports = TokenManager;