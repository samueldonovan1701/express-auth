'use strict';

class UserManager {
	constructor(model = {}) {
		this._users = {};
		this._model = model;
	}

//Create
	new(id, pw="", model=this._model) {
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
		let user = this._users[id];

		if(user == undefined)
			return undefined;
		else
			return user.model;
	}
	verifyPW(id, pw) {
		let user = this._users[id];

		if(user == undefined)
			return undefined;
		else
			return user.pw == pw;
	}
	all() {
		return Object.keys(this._users);
	}

//Update
	set(id, model) {
		let user = this._users[id];

		if(user == undefined)
			return undefined;
		else {
			user.model = model;
			return true;
		}
	}
	setID(old, updated) {
		if(!(old in this._users))
			return undefined;
		if(updated in this._users)
			return false;

		this._users[updated] = this._users[old];
		delete this._users[old];
		return true;
	}
	setPW(id, newPW) {
		let user = this._users[id];

		if(user == undefined)
			return undefined;
		else {
			user.pw = newPW;
			return true;
		}
	}

//Delete
	del(id) {
		if(!(id in this._users))
			return undefined;

		delete this._users[id];
		return true;
	}
};

module.exports = UserManager;