function properCase(string) {

	const ret = string.replace(/([A-Z])/g, " $1");
	return ret.charAt(0).toUpperCase() + ret.slice(1);

}
const validNumber = /([0-9]+(\.[0-9]+)?)([eE]([\+\-])?([0-9]+(\.[0-9]+)?))?/g
const username = f("username");
const current = f("current");
const objectcp = f("objectcp");
const stringcp = f("stringcp")
const integercp = f("integercp")
const booleancp = f("booleancp")
const arraycp = f("arraycp")
const path = f("path")

document.onkeydown = function (e) {
	console.log(e.key)
	if (document.activeElement) {
		if (document.activeElement.type === "number") {
			console.log(document.activeElement.value)
			if (!((!document.activeElement.value.toLowerCase().includes("e")) && e.key === "e")) {
				if (e.key === "e") {
					e.preventDefault();
					return false;
				}
			}
			if (!e.ctrlKey) {
				if ((e.key !== "ArrowLeft") && (e.key !== "ArrowRight") && (e.key !== "End") && (e.key !== "Home") && (e.key !== "Backspace")) {
					if (!(document.activeElement.value + e.key).match(validNumber)) {
						e.preventDefault()
						return false;

					}
				}
			}


		}
	}

}
const comms = new Comms()
comms.ready = () => {
	AuthyAttemptSignIn(comms)
}
let settings = {}
let lsettings = {};
let loc = []
AuthyData.login = () => {
	comms.send("get", "settings", {})
	comms.on("get", (msg) => {
		settings = msg.body;
		renderSettings(msg.body)
	})
	username.textContent = AuthyData.user
}

function renderSettings(obj) {
	//This should be called view
	//It is called current due to the original design
	current.innerHTML = "";

	let i = "";
	for (i in obj) {
		switch (typeof obj[i]) {
			case "object": {
				//TODO: If object is array



				/**
				 * @type {HTMLDivElement}
				 */
				let ic = objectcp.cloneNode(true);

				ic.children[0].textContent = properCase(i);
				ic.name = i;
				ic.onclick = function (e) {
					loc.push(this.name)
					render();

				}
				current.appendChild(ic);
				break;
			}
			case "string": {
				/**
				 * @type {HTMLDivElement}
				 */
				let ic = stringcp.cloneNode(true);

				ic.children[0].textContent = properCase(i);
				ic.children[1].value = obj[i];

				ic.children[1].onblur = function (e) {
					settings = access(loc.concat(this.parentElement.name), settings, this.value)
					comms.send("set", "settings", settings)
				}
				ic.name = i;

				current.appendChild(ic);

				break;
			}
			case "number": {

				break;
			}
			case "boolean": {

				break;
			}

		}
	}
}

function render() {
	renderPath()
	renderSettings(access(loc, settings))
}

function renderPath() {
	//Path Item On Click
	function pioc() {
		let itr = (loc.length - this.count);
		for (let i = 0; i < itr; i++) {
			loc.pop()
		}
		render()
	}
	path.textContent = ""
	let i = ""
	let root = document.createElement("div");
	root.classList.add("pathitem");
	root.textContent = " / ";
	root.count = 0;
	root.onclick = pioc;
	path.appendChild(root)
	for (i in loc) {
		//Item Div
		let id = document.createElement("div");
		id.classList.add("pathitem");
		id.textContent = properCase(loc[i]);
		id.count = i + 1;
		id.onclick = pioc
		path.appendChild(id)


	}
}

/**
 * Acess property of object as done
 * in light json db
 * @param {Array} prop 
 * @param {Object} obj 
 */
function access(prop, obj, set) {
	let nobj = obj;
	let ap = "obj"
	for (i of prop) {
		nobj = nobj[i];
		ap += '["' + i + '"]'
	}
	console.log(ap)
	if (set) {

		//FIXME 
		// | Works but
		// V Potentially unsafe
		eval(ap + "=set")
		// N
		// |

		return obj
	}
	return nobj;
}






renderPath()