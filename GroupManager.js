'use strict';

class GroupManager {
	#groups;
	#model;
	constructor(model = {"id": "", "users":[]}) {
		this.#groups = {};
		this.model = model;
	}

//Create
	new(id, users=[], model=this.model) {
		if(id in this.#groups)
			return false;

		//Check that model is an object
		if(typeof model != "object" && typeof model != "function")
			model = {"value": model};

		//Set id
		model.id = id;

		//Set users
		model.users = users;

		//Set
		this.#groups[id] = model;

		return true;
	}

//Read
	get(id) {
		return this.#groups[id];
	}
	with(userID) {
		let groups = [];

		if(userID === undefined)
			return undefined;

		for (const [groupID, group] of Object.entries(this.#groups)) {
  			if(group.users.includes(userID))
  				groups.push(groupID);
		}

		return groups;
	}
	all() {
		return Object.keys(this.#groups);
	}

//Update
	set(id, model) {
		let old = this.#groups[id];

		if(old == undefined)
			return undefined;
		else {
			//Check that model is an object			
			if(typeof model != "object" && typeof model != "function")
				model = {"value": model};

			//Check model.users exists and is an array. If not, keep old
			if(!model.hasOwnProperty("users"))
				model.users = old.users
			if(!Array.isArray(model.users)) 
				model.users = old.users;
			
			//Set id
			model.id = id;

			//Set model
			this.#groups[id] = model;

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