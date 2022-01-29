
'use strict';

class GroupManager {
	constructor() {
		this._groups = {};
	}

//Methods
	new(id, users=[]) {
		if(id in this._groups)
			return false;

		this._groups[id] = users;
		return true;
	}
	del(id) {
		if(!(id in this._groups))
			return false;

		delete this._groups[id];
		return true;
	}
	all() {
		return this._groups.keys();
	}

	setID(old, updated) {
		if(updated in this._groups || !(old in this._groups))
			return false;

		this._groups[updated] = this._groups[old];
		delete this._groups[old];
		return true;
	}
	setUsers(id, users) {
		if(!(id in this._groups))
			return false;

		this._groups[id] = users;
		return true;
	}
	getUsers(id) {
		if(!(id in this._groups))
			return false;

		return this._groups[id];
	}
	addUsers(id, users) {
		if(!(id in this._groups))
			return false;

		this._groups[id].concat(users);
		return true;
	}
	remUsers(id, users) {
		if(!(id in this._groups))
			return false;

		this._groups[id].filter((groupmemeber) => { 
			return users.indexOf(groupmemeber) == -1; 
		});
		return true;
	}
};

module.exports = GroupManager;