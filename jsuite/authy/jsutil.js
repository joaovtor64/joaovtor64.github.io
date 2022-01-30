/**
 * JSUTIL
 */


const f = (el) => {
	return document.getElementById(el)
}
const cf = (el) => {
	return document.getElementsByClassName(el)

}

//The Animation Pack
//Made by Joaovtor

//THESE FUNCTIONS ARE NOT CLASSES IGNORE VSCODE

function rem() {
	this.id = "deleted"

	this.style.height = "0px";
	setTimeout(() => {
		this.remove()
	}, 1000)
}

function hid() {
	if (this.style.height != "0px") {
		setTimeout(() => {
			this.style.display = "none"
		}, 1000)

		this.lh = this.style.height
		this.style.height = "0px";
	}
}

function sho() {
	this.style.display = "block"
	this.style.height = this.lh;
}

function setRem() {
	let ae = document.getElementsByTagName("*")
	let i = null;
	for (i in ae) {
		ae[i].rem = rem;
		ae[i].sho = sho;
		ae[i].hid = hid;
	}

}
setRem();