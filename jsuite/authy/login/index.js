/**
 * @type {HTMLInputElement}
 */

const username = f("username");
/**
 * @type {HTMLDivElement}
 */

const usernamebig = f("usernamebig");

/**
 * @type {HTMLInputElement}
 */
const password = f("password");
/**
 * @type {HTMLInputElement}
 */
const confirmpassword = f("confirmpassword");
/**
 * @type {HTMLDivElement}
 */
const signin = f("signin");
/**
 * @type {HTMLDivElement}
 */
const signup = f("signup");




username.addEventListener("keydown", () => {
	setTimeout(() => {
		usernamebig.textContent = username.value

	})
})

function check() {
	console.log(((username.value.length > 0) && (password.value.length > 0) && (password.value === confirmpassword.value)))
	return ((username.value.length > 0) && (password.value.length > 0) && (password.value === confirmpassword.value))
}
const comms = new Comms();
let user = ""
signin.addEventListener("click", function (el) {

	if (check()) {
		user = username.value
		AuthyWaitForSignIn(username.value)
		comms.send("signin", "authy", {
			user: username.value,
			password: password.value
		})
		setTimeout(() => {
			if (AuthyData.signedin) {
				if (opts.goto) {
					window.location.href = opts.goto;
				}
			}
		}, 3000)
	}
})
signup.addEventListener("click", function (el) {

	if (check()) {
		user = username.value;
		AuthyWaitForSignIn(username.value)
		comms.send("signup", "authy", {
			user: username.value,
			password: password.value
		})
		setTimeout(() => {
			if (AuthyData.signedin) {
				if (opts.goto) {
					window.location.href = opts.goto;
				}
			}
		}, 3000)
	}
})
comms.ready = () => {
	AuthyAttemptSignIn(comms)
}
comms.on("error", (msg) => {
	console.log(msg)
})

let opts = {}
//Parse URL
if (window.location.href.split("?")[1]) {
	try {
		opts = JSON.parse(decodeURI(window.location.href.split("?")[1]))

	} catch (_) {
		console.error("Unparsable options!")
		document.body.textContent = "Unparsable options: " + decodeURI(window.location.href.split("?")[1])
	}
}