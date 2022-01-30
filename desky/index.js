f("toolbar").hid()
/**
 * @type {HTMLDivElement}
 */
const taskbar = f("taskbar");
Grab.enable(taskbar, new GrabCallback())
/**
 * @type {Comms}
 */
const comms = new Comms();
let apps = []

comms.on("getApps", (msg) => {
	apps = msg.body
	renderApps()
})
comms.ready = () => {
	comms.send("getApps", "desky", {})
	AuthyAttemptSignIn(comms)
	//I don't know how to use Promise.resolve()
	setTimeout(() => {
		if (!AuthyData.signedin) {
			window.location.href = "/authy/login?" + encodeURI(JSON.stringify({
				goto: "/desky/"
			}))
		}
	}, 1000)
}



function renderApps() {
	//Number of apps in the taskbar
	let appn = 0;
	//Size in pixels of apps icons
	let appsz;
	let app;
	for (app of apps) {

		if (!app.hidden) {
			appn++;
			let icon = document.createElement("img");
			icon.src = "/internal/icons/" + app.name + "/0";
			icon.classList.add("icon")
			icon = taskbar.appendChild(icon)
			icon.appname = app.name;
			icon.onclick = function () {
				window.open("/" + this.appname)


			}
			appsz = icon.getBoundingClientRect().width;

		}
	}
	taskbar.style.width = appn * appsz + 40 + "px"


}