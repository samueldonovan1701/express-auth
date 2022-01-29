'use strict';

class UserManager {
	constructor() {
		this._users = {};
	}

//Methods
	new(id, pw) {
		if(id in this._users)
			return false;

		this._users[id] = pw;
		return true;
	}
	del(id) {
		if(!(id in this._users))
			return false;

		delete this._users[id];
		return true;
	}
	all() {
		return this._users.keys();
	}


	setID(old, updated) {
		if(updated in this._users || !(old in this._users))
			return false;

		this._users[updated] = this._users[old];
		delete this._users[old];
		return true;
	}
	setPW(id, newPW) {
		if(!(id in this._users))
			return false;

		this._users[id] = newPW;
		return true;
	}
	verifyPW(id, pw) {
		if(!(id in this._users))
			return false;
		
		return pw == this._users[id];
	}
};

module.exports = UserManager;