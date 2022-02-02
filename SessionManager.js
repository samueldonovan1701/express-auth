'use strict';

var crypto = require('crypto');

class SessionManager {
	#sessions;
	#model;
	constructor(model = {"id":"", "userID": "", "expires": NaN}, maxAge=3600000, purgeInterval=900000) {
		this.#sessions = {};
		this.#model = model;

		this.purgeInterval = purgeInterval; //In ms
		this.startPeriodicPurging();

		this.maxAge = maxAge; //In ms
		this.httpOnly = true;
		this.sameSite = true;
		this.secure = true;
	}

//Create
	new(userID, model=this.#model, maxAge=this.maxAge) {
		//Check that model is an object
		if(typeof model != "object" && typeof model != "function")
			model = {"value": model};

		//Check model.expires exists and is a number/date. If not, generate
		if(!model.hasOwnProperty("expires"))
			model.expires = Math.floor(Date.now()/1000 + maxAge);
		if(!(model.expires instanceof Date) && typeof model.expires != "number") 
			model.expires = Math.floor(Date.now()/1000 + maxAge);

		//Set model.userID
		model.userID = userID;

		//Generate sessionID
		let sessionID = crypto.createHash('md5')
			.update(Math.random().toString())
			.update(Date.now().toString())
			.digest('base64');

		//Set
		this.#sessions[sessionID] = model;

		return sessionID;
	}

//Read
	get(id) {
		return this.#sessions[id];
	}
	all() {
		return Object.keys(this.#sessions);
	}

//Update
	set(id, model) {
		let old = this.#sessions[id];

		//Check if sessionID exists
		if(old === undefined)
			return undefined;
		else {
			//Check that model is an object			
			if(typeof model != "object" && typeof model != "function")
				model = {"value": model};

			//Check model.expires exists and is a number/date. If not, keep old
			if(!model.hasOwnProperty("expires"))
				model.expires = old.expires;
			if(!(model.expires instanceof Date) && typeof model.expires != "number") 
				model.expires = old.expires;

			//Check if model.userID exists and is a string. If not, keep old
			if(!model.hasOwnProperty("userID"))
				model.userID = old.userID
			if(typeof model.userID != "string") 
				model.userID = old.userID;

			//Set id
			model.id = id;

			//Set model
			this.#sessions[id] = model;

			return true;
		}
	}

//Delete
	del(id) {
		if(!(id in this.#sessions))
			return false;

		delete this.#sessions[id];
		return true;
	}
	
	#currentlyPurging;
	purge() {
		const now = Date.now();
		for (const [id, session] of Object.entries(this.#sessions)) {
			try{
				if(session.expires < now)
					delete this.#sessions[id];
			} catch(err) {
				delete this.#sessions[id];
			}
		}
	}
	startPeriodicPurging() {
		this.#currentlyPurging = true;
	}
	stopPeriodicPurging() {
		this.#currentlyPurging = false;
	}
	#periodicPurge() {
		this.purge();
		if(this.#currentlyPurging)
			setTimeout(this.#periodicPurge.bind(this), this.purgeInterval);
	}
};

module.exports = SessionManager;