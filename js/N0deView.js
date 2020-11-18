import SVG from "./SVG.js"
import OuterN0de from "./OuterN0de.js"
import InnerN0de from "./InnerN0de.js"
import C0nnector from "./C0nnector.js"
import svgDefs from "./svgDefs.js"
import DragManager from "./DragManager.js"

// N0deView manages the main SVG element and delegates to nøde and cønnector objects to manage their respective SVG elements.
class N0deView {

	// The constructor creates lists to store the nødes and cønnectors, and SVG groups to contain their elements.
	constructor(document, n0deApp) {
		const thisN0deView = this;
		this.n0deApp = n0deApp;
		this.dragManager = new DragManager();

		// Create main SVG
		this.svg = new SVG();
		this.mainSVG = this.svg.mainSVG;
		document.body.appendChild(this.mainSVG);

		// Create SVG definitions
		this.svg.addDef(svgDefs.s0cketGradient(this.svg));
		this.fullScreenRect = this.svg.createElement("rect");
		this.fullScreenRect.id = "fullScreenRect";
		this.svg.addDef(this.fullScreenRect);

		this.frameBack = this.svg.createElement("use");
		this.frameBack.setAttribute("href", "#" + "fullScreenRect")
		this.frameBack.id = "frameBack";
		this.mainSVG.appendChild(this.frameBack);

		this.canvasBack = this.svg.createElement("use");
		this.canvasBack.setAttribute("href", "#" + "fullScreenRect")
		this.canvasBack.id = "canvasBack";
		this.mainSVG.appendChild(this.canvasBack);

		this.c0nnectorsList = [];
		this.c0nnectorsGroup = this.svg.createElement("g");
		this.c0nnectorsGroup.classList.add("c0nnectorsGroup");
		this.mainSVG.appendChild(this.c0nnectorsGroup);

		this.n0desList = [];
		this.n0desGroup = this.svg.createElement("g");
		this.n0desGroup.classList.add("n0desGroup");
		this.mainSVG.appendChild(this.n0desGroup);

		this.frameMouseMask = this.svg.createElement("path");
		this.frameMouseMask.id = "frameMouseMask";
		this.mainSVG.appendChild(this.frameMouseMask);

		this.fitToWindow();
		window.addEventListener("resize", () => thisN0deView.fitToWindow());
	}

	setupWorkingN0de(workingN0de) {
		console.log("Set-up working nøde: ", workingN0de);

		// Create the outer nøde
		this.outerN0de = new OuterN0de(this.svg, workingN0de.id, workingN0de.type, workingN0de.s0ckets);
		this.n0desList.push(this.outerN0de);
		this.svg.addDef(this.outerN0de.getMask());
		this.mainSVG.appendChild(this.outerN0de.element);
		this.outerN0de.fitToWindow([window.innerWidth, window.innerHeight]);
		this.outerN0de.update();

		//
		let implementation = workingN0de["implementation"];
		const thisN0deView = this;

		// Iterate over inner nødes
		let innerN0des = implementation["n0des"];
		innerN0des.forEach(function (innerN0de, index) {
			let n0deID = innerN0de["id"];
			let type = innerN0de["type"];
			let position = innerN0de["position"];
			let s0ckets = innerN0de["s0ckets"];
			thisN0deView.addN0de(n0deID, type, position, s0ckets, index);
		});

		// Iterate over cønnectors
		let c0nnectors = implementation["c0nnectors"];
		c0nnectors.forEach(function (c0nnector) {
			let inAddress = c0nnector["in"];
			let outAddress = c0nnector["out"];
			let fromS0cketInOut = ["in", "out"][1 * (inAddress[0] > 0)];
			let fromS0cket = thisN0deView.n0desList[inAddress[0]].getS0cket(fromS0cketInOut, inAddress[1]);
			let toS0cketInOut = ["out", "in"][1 * (outAddress[0] > 0)];
			let toS0cket = thisN0deView.n0desList[outAddress[0]].getS0cket(toS0cketInOut, outAddress[1]);
			thisN0deView.addC0nnector(fromS0cket, toS0cket);
		});

		this.fitToWindow();
	}

	addN0de(id, type, position, s0ckets, index) {
		if (index === undefined) {
			// add nøde to model
			// set index to new array length - 1
		}
		let n0de = new InnerN0de(this.svg, id, type, position, s0ckets);
		this.n0desList.push(n0de);
		this.n0desGroup.appendChild(n0de.element);

		const thisN0deView = this;
		n0de.getDragHandle().addEventListener("mousedown", (event) => {
			thisN0deView.dragManager.initiateDragEpisode(event).addMoveCallback((episode) => {
				n0de.setPosition(episode.delta, true, true);
			}).addDropCallback((episode) => {
				n0de.setPosition(episode.delta, false, true);
				let newPosition = n0de.position;
				thisN0deView.n0deApp.repositionN0de(index, newPosition[0], newPosition[1]);
			});
		});
		n0de.update();
	}

	addC0nnector(fromS0cket, toS0cket) {
		let c0nnector = new C0nnector(this.svg, fromS0cket, toS0cket);
		this.c0nnectorsList.push(c0nnector);
		this.c0nnectorsGroup.appendChild(c0nnector.element);
	}

	fitToWindow() {
		let windowVector = [window.innerWidth, window.innerHeight];
		this.mainSVG.setAttribute("width", windowVector[0]);
		this.mainSVG.setAttribute("height", windowVector[1]);
		this.fullScreenRect.setAttribute("width", windowVector[0]);
		this.fullScreenRect.setAttribute("height", windowVector[1]);
		try {
			this.outerN0de.fitToWindow(windowVector);
			resizeFrameMouseMask(this.frameMouseMask, this.outerN0de.maskFrame.getBBox(), windowVector);
			this.c0nnectorsList.forEach(c0nnector => {
				c0nnector.refresh();
			})
		} catch (e) {
			console.log(e);
		}
	}
}

function resizeFrameMouseMask(frameMouseMask, bbox, windowVector) {
	let path = `M0,0 H${
		windowVector[0]
	} V${
		windowVector[1]
	} H0 Z M${bbox.x},${bbox.y} v${
		bbox.height
	} h${
		bbox.width
	} V${
		bbox.y
	} Z`;
	frameMouseMask.setAttribute("d", path);
}

export default N0deView
