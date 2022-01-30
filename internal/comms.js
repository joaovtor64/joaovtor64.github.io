class Message {

	app = undefined;
	service = undefined;
	body = undefined;
	eventname = undefined;

	constructor(eventname, service, body, app) {
		this.eventname = eventname
		this.service = service;
		this.body = body;
		this.app = app;

	}
	toString() {
		//Fast JSON stringify




		//YOU WERE WARNED
		return '{"eventname":"' + this.eventname + '",' +
			'"service":"' + this.service + '",' +
			'"app":"' + this.app + '",' +
			'"body":' + JSON.stringify(this.body) + '}'


	}
}
module = {}
/**
 * Messages from client to server contain
 * the origin app (app) and the sender app (service)
 * 
 * 
 * this app/service naming pattern *should* persist troughout JSuite
 * 
 * 
 * ServerMessages don't contain a "service" since they can only send
 * info to one app, the one running the frontend.
 */

//Server messages COME FROM SERVER

class ServerMessage {


	app = undefined;

	body = undefined;
	eventname = undefined;

	constructor(eventname, body, app) {
		this.eventname = eventname
		this.body = body;
		this.app = app;

	}

}




/*

 THIS IS NOT THE SAME AS back/lib/comms.js
 
 this is the comms module for FRONTEND


*/
class Comms {
	appname = undefined;
	ws = undefined
	constructor() {
		//This should get the appname from the URL

		this.appname = window.location.href.split("/")[3]
		this.init()
	}

	async init() {
		const cfg = await (await fetch("/internal/config.json")).json();



		this.ws = new WebSocket("ws://" + cfg.comms.location + ":" + cfg.comms.port)

		this.ws.onopen = () => {
			console.log("comms started")
			this.ready();
		}
		/**
		 * Well it is a ServerMessage after parsed
		 * Same thing to me
		 * @param {ServerMessage} msg 
		 */
		this.ws.onmessage = (msg) => {

			msg = JSON.parse(msg.data)
			if (this.Events[msg.eventname]) {
				let fn;
				for (fn of this.Events[msg.eventname]) {
					fn(new ServerMessage(msg.eventname, msg.body, msg.app))
				}
			} else {
				console.log("'" +
					msg.eventname + "' was triggered but has no listener")
			}
		}
	}
	ready() {}
	Events = {};
	/**
	 * 
	 * @callback CommsOnCallback
	 * @param {ServerMessage} msg
	 */

	/**
	 * 
	 * @param {String} eventname 
	 * @param {CommsOnCallback} callback 
	 */
	on(eventname, callback) {
		if (!this.Events[eventname]) {
			this.Events[eventname] = []
		}
		this.Events[eventname].push(callback)
	}
	/**
	 * 
	 * @param {String} eventname 
	 * @param {String} service 
	 * App to send message to
	 * @param {any} value 
	 */
	send(eventname, service, value) {
		this.ws.send(new Message(eventname, service, value, this.appname))

	}

}

module.exports = Comms;