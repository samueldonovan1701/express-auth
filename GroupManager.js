'use strict';

class GroupManager {
	#groups;
	#model;
	constructor(model = {}) {
		this.#groups = {};
		this.#model = model;
	}

//Create
	new(id, users) {
		if(id in this.#groups)
			return false;

		this.#groups[id] = {
			"users": users,
			"model": this.#model
		};
		return true;
	}

//Read
	get(id) {
		let group = this.#groups[id];

		if(group == undefined)
			return undefined;
		else
			return group;
	}
	all() {
		return Object.keys(this.#groups);
	}

//Update
	set(id, model) {
		let group = this.#groups[id];

		if(group == undefined)
			return undefined;
		else {
			group.model = model;
			return true;
		}
	}
	setID(old, updated) {
		if(!(old in this.#groups))
			return undefined;
		if(updated in this.#groups)
			return false;

		this.#groups[updated] = this.#groups[old];
		delete this.#groups[old];
		return true;
	}
	setUsers(id, users) {
		let group = this.#groups[id];

		if(group == undefined)
			return undefined;
		else {
			group.users = users;
			return true;
		}
	}
	addUsers(id, users) {
		let group = this.#groups[id];

		if(group == undefined)
			return undefined;
		else {
			group.users.concat(users);
			return true;
		}
	}
	remUsers(id, users) {
		let group = this.#groups[id];

		if(group == undefined)
			return undefined;
		else {
			group.users.filter((groupmemeber) => { 
				return users.indexOf(groupmemeber) == -1; 
			});
			return true;
		}
	}

//Delete
	del(id) {
		if(!(id in this.#groups))
			return undefined;

		delete this.#groups[id];
		return true;
	}
};

module.exports = GroupManager;