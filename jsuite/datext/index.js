const comms = new Comms();
/**
 * @type {HTMLTextAreaElement}
 */
const file = f("file")
const filename = f("filename")
const username = f("username")
comms.ready = () => {
	AuthyAttemptSignIn(comms);

}
let filepath;
AuthyData.login = () => {
	username.textContent = AuthyData.user;
	if (window.location.href.split("?")[1]) {
		let d = (JSON.parse(decodeURI(window.location.href.split("?")[1])))
		if (d.from === "drive") {
			comms.send("get", "drive", {
				key: d.open
			})
			filepath = d.open;
			filename.textContent = d.open[d.open.length - 1]

		}
	} else {
		file.value = "No file specified"
	}

}
comms.on("get", function (msg) {
	if (msg.app === "drive") {
		file.value = msg.body
	}
})
setInterval(() => {
	autoSave()
}, 5000)
/**
 * Oll Korect
 */
let ok = false;

function autoSave() {
	if (!ok) {
		comms.send("set", "drive", {
			key: filepath,
			val: file.value
		})
	}
}
file.onkeydown = (e) => {
	ok = false
	if (e.ctrlKey) {
		if (e.key === "s") {
			autoSave();
			return false
		}
	}
	return true
};
comms.on("ok", (msg) => {

	if (msg.app === "drive") {
		ok = true;
	}
})
window.onbeforeunload = () => ok