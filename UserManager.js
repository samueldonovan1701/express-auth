'use strict';

class UserManager {
	constructor(model = {}) {
		this._users = {};
		this._model = model;
	}

//Create
	new(id, pw) {
		if(id in this._users)
			return false;

		this._users[id] = {
			"pw": pw,
			"model": this._model
		};
		return true;
	}

//Read
	get(id) {
		if(!(id in this._users))
			return false;

		return this._users[id].model;
	}
	verifyPW(id, pw) {
		if(!(id in this._users))
			return false;
		
		return pw == this._users[id];
	}
	all() {
		return Object.keys(this._users);
	}

//Update
	set(id, model) {
		if(!(id in this._users))
			return false;

		this._users[id].model = model;
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

//Delete
	del(id) {
		if(!(id in this._users))
			return false;

		delete this._users[id];
		return true;
	}
};

module.exports = UserManager;