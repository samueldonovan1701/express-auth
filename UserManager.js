'use strict';

class UserManager {
	#users;
	defaultModel;
	constructor(defaultModel = {"id":"", "password":""}) {
		// Input Validation
		if(typeof defaultModel != "object")
			throw TypeError("express-cookie-session-auth.UserManager(defaultModel): typeof `defaultModel` is not 'object'")

		this.#users = {};
		this.defaultModel = defaultModel;
	}

/*******************************************************************************
********************************************************************************
* Create Functions
********************************************************************************
*******************************************************************************/
	add(id, password, model=this.defaultModel) {
		// Input Validation
		if(typeof id != "string")
			throw TypeError("express-cookie-session-auth.UserManager.add(id, password, model): typeof `id` is not 'string'")
		if(typeof password != "string")
			throw TypeError("express-cookie-session-auth.UserManager.add(id, password, model): typeof `password` is not 'string'")
		if(typeof model != "object")
			throw TypeError("express-cookie-session-auth.UserManager.add(id, password, model): typeof `model` is not 'object'")
	
		// Check that user exists
		if(id in this.#users)
			return false;

		// Set id
		model.id = id;

		// Set password
		model.password = password;

		// Add User
		this.#users[id] = model;

		return true;
	}

/*******************************************************************************
********************************************************************************
* Read Functions
********************************************************************************
*******************************************************************************/
	get(id) {
		// Input Validation
		if(typeof id != "string")
			throw TypeError("express-cookie-session-auth.UserManager.get(id): typeof `id` is not 'string'")
	
		// Get User
		return this.#users[id];
	}
	verify(id, password) {
		// Input Validation
		if(typeof id != "string")
			throw TypeError("express-cookie-session-auth.UserManager.verify(id, password): typeof `id` is not 'string'")
		if(typeof password != "string")
			throw TypeError("express-cookie-session-auth.UserManager.verify(id, password): typeof `password` is not 'string'")

		// Get User
		let user = this.#users[id];
		if(user === undefined) //Username not found
			return undefined;
	
		// Compare passwords
		return (user.password === password);
	}
	all() {
		return Object.keys(this.#users);
	}

/*******************************************************************************
********************************************************************************
* Update Functions
********************************************************************************
*******************************************************************************/
	set(id, model=this.defaultModel) {
		// Input Validation
		if(typeof id != "string")
			throw TypeError("express-cookie-session-auth.UserManager.set(id, model): typeof `id` is not 'string'")
		if(model.hasOwnProperty("password") && typeof model.password != "string")
			throw TypeError("express-cookie-session-auth.UserManager.set(id, model): typeof `model.password` is not 'string'")
		if(typeof model != "object")
			throw TypeError("express-cookie-session-auth.UserManager.set(id, model): typeof `model` is not 'object'")
		
		// Check if user exists
		let current = this.#users[id];
		if(current === undefined)
			return undefined;

		//Check model.password exists. If not, keep old
		if(!model.hasOwnProperty("password"))
			model.password = current.password

		//Set id
		model.id = id;

		//Set model
		this.#users[id] = model;

		return true;
	}

//Delete
	del(id) {
		// Input Validation
		if(typeof id != "string")
			throw TypeError("express-cookie-session-auth.UserManager.del(id): typeof `id` is not 'string'")
		
		if(this.#users[id] == undefined)
			return undefined;

		delete this.#users[id];
		return true;
	}
};

module.exports = UserManager;