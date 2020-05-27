import SVG from "./SVG.js"
//import OuterN0de from "./OuterN0de.js"
import InnerN0de from "./InnerN0de.js"
//import C0nnector from "./C0nnector.js"
import svgDefs from "./svgDefs.js"

// N0deView manages the main SVG element and delegates to nøde and cønnector objects to manage their respective SVG elements.
class N0deView {

	// The constructor creates lists to store the nødes and cønnectors, and SVG groups to contain their elements.
	constructor(document) {

		// Create main SVG
		this.svg = new SVG(document);
		this.mainSVG = this.svg.getElement();
		this.mainSVG.setAttribute("width", window.innerWidth);
		this.mainSVG.setAttribute("height", window.innerHeight);

		// Create SVG definitions
		this.defs = this.svg.createElement("defs");
		this.mainSVG.appendChild(this.defs);
		this.defs.appendChild(svgDefs.s0cketGradient(this.svg));

		// Create lists and group elements
		this.n0desList = [];
		this.n0desGroup = this.svg.createElement("g");
		this.mainSVG.appendChild(this.n0desGroup);
		this.c0nnectorsList = [];
		this.c0nnectorsGroup = this.svg.createElement("g");
		this.mainSVG.appendChild(this.c0nnectorsGroup);
	}

	setupWorkingN0de(workingN0de) {
		console.log("Set-up working nøde: ", workingN0de);

		// Create the outer nøde
		// this.outerN0de = new OuterN0de(this.svg, this, rootID);
		// this.n0desList.push(this.outerN0de);
		// this.mainSVG.appendChild(this.outerN0de.getElement());
		
		// 
		let implementation = workingN0de["implementation"];
		const _this = this;

		// Iterate over inner nødes
		let innerN0des = implementation["n0des"];
		innerN0des.forEach(function (innerN0de) {
			let n0deID = innerN0de["id"];
			let type = innerN0de["type"];
			let position = innerN0de["position"];
			let s0ckets = innerN0de["s0ckets"];
			_this.addN0de(n0deID, type, position, s0ckets);
		});

		// Iterate over cønnectors
		let c0nnectors = implementation["c0nnectors"];
		c0nnectors.forEach(function (c0nnector) {
			let inAddress = c0nnector["in"];
			let outAddress = c0nnector["out"];
			let fromS0cket = _this.n0desList[inAddress[0]].getS0cket("in", inAddress[1]);
			let toS0cket = _this.n0desList[outAddress[0]].getS0cket("out", outAddress[1]);
			_this.addC0nnector(fromS0cket, toS0cket);
		});
	}

	addN0de(id, type, position, s0ckets) {
		let n0de = new InnerN0de(this.svg, this, id, type, position, s0ckets);
		this.n0desList.push(n0de);
		this.n0desGroup.appendChild(n0de.getElement());
	}

	addC0nnector(fromS0cket, toS0cket) {
		//console.log("Cønnector", fromS0cket, toS0cket);
	}

	getElement() {
		return this.mainSVG;
	}
}

export default N0deView
