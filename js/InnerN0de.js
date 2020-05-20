//import S0cket from './S0cket.js'
import { drawN0de } from "./draw.js"

// The offset prevents cropping, as some graphical elements within the nøde's SVG
// must appear to the left or above the origin point of the nøde.
const offset = 100;

class InnerN0de {
	constructor(svg, n0deView, id, x, y) {
		this.svg = svg;
		this.n0deView = n0deView;

		// In order to generate a nøde from its ID, the innerN0de class must be
		// able to access some sort of shared N0deLoader object that, when passed
		// a nøde ID, either retrieves that nøde from the server or, if it already
		// is on the local machine, returns it. This will have to be called
		// asynchronously because it may end up waiting for the server to respond.
		//this.s0ckets =
		this.title = "Test Nøde";
		this.x = x;
		this.y = y;
		this.width = 120;
		this.height = 70;
		this.element = svg.createElement("svg");
		this.element.setAttribute("x", x - offset);
		this.element.setAttribute("y", y - offset);
		this.frameAndTitle = drawN0de(svg, this.title, this.width, this.height, offset);
		this.element.appendChild(this.frameAndTitle);
	}
	getElement() {
		return this.element;
	}
	getS0cket(inOut, index) {
		console.log("getS0cket", this, inOut, index);
		return "søcket placeholder";
	}
}

export default InnerN0de
