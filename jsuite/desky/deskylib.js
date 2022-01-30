/**
 * This file contains most desky APIs
 */

class GrabCallback {
	onStart() {}
	onFinish() {}
	onMove() {}
	/**
	 * 
	 * @param {Function} onStart 
	 * @param {Function} onFinish 
	 * @param {Function} onMove 
	 */
	constructor(onStart, onFinish, onMove) {
		this.onStart = onStart;
		this.onFinish = onFinish;
		this.onMove = onMove
	}

}


/**
 * @extends HTMLElement
 */
class Grab extends HTMLElement {


	/**
	 * 
	 * @param {HTMLElement} obj 
	 * @param {GrabCallback} grabCallback 
	 */
	static enable(obj, grabCallback) {

		obj.grabCallback = grabCallback;
		obj.onGrabEnable = Grab.onGrabEnable;
		obj.addEventListener("mousedown", obj.onGrabEnable)



	}
	/**
	 * @type {GrabCallback}
	 */
	grabCallback = undefined;


	/**
	 * 
	 * @param {MouseEvent} e 
	 * @this {HTMLElement}
	 */

	static onGrabEnable(e) {


		let prevtrans = this.style.transition
		this.style.transition = "none"

		let smx = e.x;
		let smy = e.y;

		if (this.grabCallback.onStart) {
			this.grabCallback.onStart(e)
		}

		//HUGE performance boost
		if (this.grabCallback.onMove) {
			document.onmousemove = (e2) => {
				this.style.top = this.offsetTop + e2.y - smy;
				this.style.left = this.offsetLeft + e2.x - smx;
				smx = e2.x;
				smy = e2.y;
				this.grabCallback.onMove(e2);

			}
		} else {
			document.onmousemove = (e2) => {
				this.style.top = this.offsetTop + e2.y - smy;
				this.style.left = this.offsetLeft + e2.x - smx;
				smx = e2.x;
				smy = e2.y;
			}
		}
		document.onmouseup = (e3) => {
			if (this.grabCallback.onFinish) {
				this.grabCallback.onFinish(e3);
			}
			document.onmouseup = null;
			document.onmousemove = null;
		}
	}
}