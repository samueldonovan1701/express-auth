'use strict';

class UserManager {
	#users;
	#model;
	constructor(model = {"id":"", "password":""}) {
		this.#users = {};
		this.model = model;
	}

//Create
	add(id, password, model=this.model) {
		if(id in this.#users)
			return false;

		//Check that model is an object
		if(typeof model != "object" && typeof model != "function")
			model = {"value": model};

		//Set id
		model.id = id;

		//Set password
		model.password = password;

		//Set
		this.#users[id] = model;

		return true;
	}

//Read
	get(id) {
		return this.#users[id];
	}
	all() {
		return Object.keys(this.#users);
	}

//Update
	set(id, model) {
		let old = this.#users[id];

		if(old === undefined)
			return undefined;
		else {
			//Check that model is an object			
			if(typeof model != "object" && typeof model != "function")
				model = {"value": model};

			//Check model.password exists and is a string. If not, keep old
			if(!model.hasOwnProperty("password"))
				model.password = old.password
			if(typeof model.password != "string") 
				model.password = old.password;

			//Set id
			model.id = id;

			//Set model
			this.#users[id] = model;

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