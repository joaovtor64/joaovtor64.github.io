class AuthyData {
	static listeningForSignin = false
	static user = undefined
	static signedin = undefined;
	static login() {

	}
}


function AuthyWaitForSignIn(user) {
	if (!AuthyData.listeningForSignin) {
		AuthyData.listeningForSignin = true;
		comms.on("error", (msg) => {
			if (msg.app === "authy") {
				AuthyData.signedin = false
			}
		})
		comms.on("signin", (msg) => {
			AuthyData.user = user;
			AuthyData.login(user)
			if (msg.app === 'authy') {
				if (msg.body) {
					AuthyData.signedin = true;
					AuthySaveSat(user)
				}
			}
		})
	}

}
/**
 * 
 * @param {Comms} comms 
 */
function AuthyAttemptSignIn(comms) {



	if (localStorage.getItem("authy.user")) {
		let user = localStorage.getItem("authy.user");
		AuthyData.user = user;
		AuthyWaitForSignIn(user);
		comms.send("signin", "authy", {
			sat: localStorage.getItem("authy.sat"),
			user
		})

	}
}

function AuthySaveSat(user) {




	comms.send("satcreate", "authy", {});
	comms.on("satcreate", (msg) => {
		localStorage.setItem("authy.sat", msg.body)
		localStorage.setItem("authy.user", user)

	})




}