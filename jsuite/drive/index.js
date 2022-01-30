const username = f("username")
let comms = new Comms();
let loc = []
const pathitemcp = f("pathitemcp")
const path = f("path")
comms.on("error", (msg) => console.log(msg.body))
comms.ready = () => {
	AuthyAttemptSignIn(comms)
	setTimeout(() => {
		if (!AuthyData.signedin) {
			window.location.href = "/authy/login/?" + encodeURI(JSON.stringify({
				goto: "/drive/"
			}))
		}
	}, 1000)


}
AuthyData.login = (user) => {
	username.textContent = user
	reload()
}
//This is very bad
//Cache is only used to remember keys at 
//locations already fetched.
class Cache {
	static entries = {}
}

/**
 * @type {HTMLDivElement}
 */
const itemcp = f("itemcp");

/**
 * i have to put this everywhere now
 * @type {HTMLDivElement}
 */
const view = f("view");
/**
 * @type {HTMLDivElement}
 */
const newfile = f("newfile");
/**
 * @type {HTMLDivElement}
 */
const newfolder = f("newfolder");
/**
 * @type {HTMLDivElement}
 */
const namepopup = f("namepopup");
/**
 * @type {HTMLDivElement}
 */
const cancel = f("cancel");

/**
 * @type {HTMLDivElement}
 */
const create = f("create");
/**
 * @type {HTMLDivElement}
 */
const cont1 = f("cont1");
/**
 * aAAAAAAAAAA
 * @type {HTMLInputElement}
 */
const nameinput = f("nameinput");




function list(keys) {
	view.innerHTML = "";
	for (i in keys) {
		if (keys[i].type === "folder") {
			let ic = itemcp.cloneNode(true);
			ic.children[1].textContent = i;
			ic.path = i;
			ic.onclick = function () {
				loc.push(this.path);
				if (!Cache.entries[JSON.stringify(loc)]) {
					comms.send("keys", "drive", {
						key: loc
					})
				} else {
					renderPath()
					list(Cache.entries[JSON.stringify(loc)]);

				}
			}
			view.appendChild(ic);

		} else {
			let ic = itemcp.cloneNode(true);
			ic.children[0].src = "/drive/file.svg"
			ic.children[1].textContent = i;
			ic.path = i
			ic.onclick = function () {
				//TODO 
				//Using server.js, /datext?(anything) glitches out
				//So its forced to do /datext/?{}
				window.open("/datext/?" + JSON.stringify({
					from: "drive",
					open: loc.concat(this.path)
				}))
			}
			view.appendChild(ic);
		}
	}
	if (Object.keys(keys).length === 0) {
		view.classList.add("empty")
		view.textContent = 'There is nothing here, you can add a folder or file from the "New" menu.'
	} else {
		view.classList.remove("empty")
	}
}
comms.on("keys", (msg) => {
	renderPath();
	list(msg.body.content)

	Cache.entries[JSON.stringify(msg.body.key)] = msg.body.content;

})

function reload() {
	let ent = JSON.stringify(loc);
	if (Cache.entries[ent]) {
		list(Cache.entries[ent])
	} else {
		comms.send("keys", "drive", {
			key: loc
		})
	}
}
/**
 * @type {"data"|"folder"}
 */
let creating = "none"

function createfile() {
	creating = "data"
	cont1.classList.add("blur")
	namepopup.classList.remove("hid")
	nameinput.select()

}
/**
 *
 let ic = itemcp.cloneNode(true);
 ic.children[1].textContent = "Name";
 view.appendChild(ic);
 */
function createfolder() {
	creating = "folder"

	cont1.classList.add("blur")
	namepopup.classList.remove("hid")
	nameinput.select()
}

newfile.onclick = createfile
newfolder.onclick = createfolder
cancel.onclick = function () {
	namepopup.classList.add("hid");
	cont1.classList.remove("blur")

}
create.onclick = function () {
	if (nameinput.value) {
		Cache.entries[JSON.stringify(loc)][nameinput.value] = {
			//Creating is what is being created
			//"data" or "folder"
			type: creating
		};
		reload()
		//Hide popup
		namepopup.classList.add("hid");
		cont1.classList.remove("blur")


		//Send to server
		if (creating === "data") {
			comms.send("set", "drive", {
				//Array references are annoying
				key: loc.concat([nameinput.value]),
				val: ""
			})
		} else {
			comms.send("dir", "drive", {
				//Array references are annoying
				key: loc.concat([nameinput.value]),

			})
		}

	}
}

function pathitemonclick() {
	for (let i = 0; i < (loc.length - this.count); i++) {
		loc.pop()
	}
	renderPath();
	list(Cache.entries[JSON.stringify(loc)])

}

function renderPath() {
	path.textContent = ""
	let root = pathitemcp.cloneNode(true)
	root.children[0].textContent = "/";
	root.count = 0
	root.onclick = pathitemonclick
	path.appendChild(root);
	for (i in loc) {
		let pic = pathitemcp.cloneNode(true)
		pic.children[0].textContent = loc[i];
		pic.count = i + 1
		pic.onclick = pathitemonclick
		path.appendChild(pic);
	}
}