'use strict';

class UserManager {
	#users;
	#model;
	constructor(model = {}) {
		this.#users = {};
		this.#model = model;
	}

//Create
	new(id, pw="", model=this.#model) {
		if(id in this.#users)
			return false;

		this.#users[id] = {
			"pw": pw,
			"model": model
		};
		return true;
	}

//Read
	get(id) {
		let user = this.#users[id];

		if(user == undefined)
			return undefined;
		else
			return user.model;
	}
	verifyPW(id, pw) {
		let user = this.#users[id];

		if(user == undefined)
			return undefined;
		else
			return user.pw == pw;
	}
	all() {
		return Object.keys(this.#users);
	}

//Update
	set(id, model) {
		let user = this.#users[id];

		if(user == undefined)
			return undefined;
		else {
			user.model = model;
			return true;
		}
	}
	setID(old, updated) {
		if(!(old in this.#users))
			return undefined;
		if(updated in this.#users)
			return false;

		this.#users[updated] = this.#users[old];
		delete this.#users[old];
		return true;
	}
	setPW(id, newPW) {
		let user = this.#users[id];

		if(user == undefined)
			return undefined;
		else {
			user.pw = newPW;
			return true;
		}
	}

//Delete
	del(id) {
		if(!(id in this.#users))
			return undefined;

		delete this.#users[id];
		return true;
	}
};

module.exports = UserManager;