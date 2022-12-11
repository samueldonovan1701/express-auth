'use strict';

class GroupManager {
	#groups;
	defaultModel;
	constructor(defaultModel = {"id": "", "users":[]}) {
		// Input Validation
		if(typeof defaultModel != "object")
			throw TypeError("express-cookie-session-auth.GroupManager(defaultModel): typeof `defaultModel` is not 'object'")

		
		this.#groups = {};
		this.defaultModel = model;
	}

/*******************************************************************************
********************************************************************************
* Create Functions
********************************************************************************
*******************************************************************************/
	new(id, users=[], model=this.defaultModel) {
		// Input Validation
		if(typeof id != "string")
			throw TypeError("express-cookie-session-auth.GroupManager.add(id, users, model): `typeof id` is not 'string'")
		if(!Array.isArray(users))
			throw TypeError("express-cookie-session-auth.GroupManager.add(id, users, model): `Array.isArray(users)` returns false")
		if(typeof model != "object")
			throw TypeError("express-cookie-session-auth.GroupManager.add(id, users, model): `typeof model` is not 'object'")


		// Check that group doesn't exist
		if(id in this.#groups)
			return false;

		// Set id
		model.id = id;

		// Set users
		model.users = users;

		// Add Group
		this.#groups[id] = model;

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
			throw TypeError("express-cookie-session-auth.GroupManager.get(id): `typeof id` is not 'string'")
		
		return this.#groups[id];
	}
	with(userID) {
		// Input Validation
		if(typeof userID != "string")
			throw TypeError("express-cookie-session-auth.GroupManager.with(userID): `typeof userID` is not 'string'")
		
		let groups = [];

		for (const [groupID, group] of Object.entries(this.#groups)) {
  			if(group.users.includes(userID))
  				groups.push(groupID);
		}

		return groups;
	}
	verify(userID, groupID) {
		// Input Validation
		if(typeof userID != "string")
			throw TypeError("express-cookie-session-auth.GroupManager.verify(userID, groupID): `typeof userID` is not 'string'")
		if(typeof groupID != "string")
			throw TypeError("express-cookie-session-auth.GroupManager.verify(userID, groupID): `typeof groupID` is not 'string'")
		
		// Get Group
		let group = this.#groups[id];
		if(group === undefined) //Group not found
			return undefined;

		// Verify user in group
		return group.users.includes(userID);
	}
	all() {
		return Object.keys(this.#groups);
	}

/*******************************************************************************
********************************************************************************
* Update Functions
********************************************************************************
*******************************************************************************/
	set(id, model=this.defaultModel) {
		// Input Validation
		if(typeof id != "string")
			throw TypeError("express-cookie-session-auth.GroupManager.set(id, model): `typeof id` is not 'string'")
		if(model.hasOwnProperty("users") && !Array.isArray(users))
			throw TypeError("express-cookie-session-auth.GroupManager.set(id, model): `Array.isArray(users)` returns false")
		if(typeof model != "object")
			throw TypeError("express-cookie-session-auth.GroupManager.set(id, model): `typeof model` is not 'object'")
		
		// Check if group exists
		let current = this.#groups[id];
		if(current == undefined)
			return undefined;

		//Check model.users exists. If not, keep old
		if(!model.hasOwnProperty("users"))
			model.users = current.users//Check that model is an object			

		//Set id
		model.id = id;

		//Set model
		this.#groups[id] = model;

		return true;
	}
	addUserTo(groupID, userID) {
		// Input Validation		
		if(typeof groupID != "string")
			throw TypeError("express-cookie-session-auth.GroupManager.addUserTo(groupID, userID): `typeof groupID` is not 'string'")
		if(typeof userID != "string")
			throw TypeError("express-cookie-session-auth.GroupManager.addUserTo(groupID, userID): `typeof userID` is not 'string'")

		// Check if group exists
		let group = this.#groups[id];
		if(group === undefined)
			return undefined;
		
		// Check if user is already in group
		if(group.users.includes(userID))
			return false;
		
		// Update group users
		group.users.push(userID);

		// Update group
		this.#groups[id] = group;

		return true;
	}
	delUserFrom(groupID, userID) {
		// Input Validation		
		if(typeof groupID != "string")
			throw TypeError("express-cookie-session-auth.GroupManager.addUserTo(groupID, userID): `typeof groupID` is not 'string'")
		if(typeof userID != "string")
			throw TypeError("express-cookie-session-auth.GroupManager.addUserTo(groupID, userID): `typeof userID` is not 'string'")

		// Check if group exists
		let group = this.#groups[id];
		if(group === undefined)
			return undefined;
		
		
		// Check if user is already in group
		if(!group.users.includes(userID))
			return false;
		
		// Update group users
		group.users = group.users.filter((val) => val != userID);

		// Update group
		this.#groups[id] = group;

		return true;
	}
	setUsers(groupID, userIDs) {
		// Input Validation		
		if(typeof groupID != "string")
			throw TypeError("express-cookie-session-auth.GroupManager.addUserTo(groupID, userIDs): `typeof groupID` is not 'string'")
		if(!Array.isArray(userIDs))
			throw TypeError("express-cookie-session-auth.GroupManager.addUserTo(groupID, userIDs): `Array.isArray(userIDs)` returns false")
		if(!userIDs.every((val) => typeof val == 'string'))
			throw TypeError("express-cookie-session-auth.GroupManager.addUserTo(groupID, userIDs): Not every value in `userIDs` is a string")
		
		// Check if group exists
		let group = this.#groups[id];
		if(group === undefined)
			return undefined;
		
		// Update group users
		group.users = userIDs;

		// Update group
		this.#groups[id] = group;

		return true;
	}
	clearUsers(groupID) {
		// Input Validation		
		if(typeof groupID != "string")
			throw TypeError("express-cookie-session-auth.GroupManager.addUsclearUserserTo(groupID): `typeof groupID` is not 'string'")

		// Check if group exists
		let group = this.#groups[id];
		if(group === undefined)
			return undefined;
		
		// Update group users
		group.users = []

		// Update group
		this.#groups[id] = group;

		return true;
	}

/*******************************************************************************
********************************************************************************
* Delete Functions
********************************************************************************
*******************************************************************************/
	del(id) {
		// Input Validation
		if(typeof id != "string")
			throw TypeError("express-cookie-session-auth.GroupManager.del(id): `typeof id` is not 'string'")
		
		if(this.#groups[id] == undefined)
			return undefined;

		delete this.#groups[id];
		return true;
	}
};

module.exports = GroupManager;