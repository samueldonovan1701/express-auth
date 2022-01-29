'use strict';

class GroupManager {
	constructor(model = {}) {
		this._groups = {};
		this._model = model;
	}

//Create
	new(id, model=this._model, users) {
		if(id in this._groups)
			return false;

		this._groups[id] = {
			"users": users,
			"model": model
		};
		return true;
	}

//Read
	get(id) {
		let group = this._groups[id];

		if(group == undefined)
			return undefined;
		else
			return group;
	}
	all() {
		return Object.keys(this._groups);
	}

//Update
	set(id, model) {
		let group = this._groups[id];

		if(group == undefined)
			return undefined;
		else {
			group.model = model;
			return true;
		}
	}
	setID(old, updated) {
		if(!(old in this._groups))
			return undefined;
		if(updated in this._groups)
			return false;

		this._groups[updated] = this._groups[old];
		delete this._groups[old];
		return true;
	}
	setUsers(id, users) {
		let group = this._groups[id];

		if(group == undefined)
			return undefined;
		else {
			group.users = users;
			return true;
		}
	}
	addUsers(id, users) {
		let group = this._groups[id];

		if(group == undefined)
			return undefined;
		else {
			group.users.concat(users);
			return true;
		}
	}
	remUsers(id, users) {
		let group = this._groups[id];

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
		if(!(id in this._groups))
			return undefined;

		delete this._groups[id];
		return true;
	}
};

module.exports = GroupManager;