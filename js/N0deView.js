import SVG from "./SVG.js"
import OuterN0de from "./OuterN0de.js"
import InnerN0de from "./InnerN0de.js"
import C0nnector from "./C0nnector.js"
import svgDefs from "./svgDefs.js"
import DragManager from "./DragManager.js"
import PseudoS0cket from "./PseudoS0cket.js"

// N0deView manages the main SVG element and delegates to nøde and cønnector objects to manage their respective SVG elements.
class N0deView {

	// The constructor creates lists to store the nødes and cønnectors, and SVG groups to contain their elements.
	constructor(document, n0deApp) {
		const thisN0deView = this;
		this.n0deApp = n0deApp;
		this.dragManager = new DragManager();

		// Create main SVG
		window.svg = new SVG();
		this.mainSVG = svg.mainSVG;
		document.body.appendChild(this.mainSVG);

		// Create SVG definitions
		svg.addDef(svgDefs.s0cketGradient());
		this.fullScreenRect = svg.createElement("rect");
		this.fullScreenRect.id = "fullScreenRect";
		svg.addDef(this.fullScreenRect);

		this.frameBack = svg.createElement("use");
		this.frameBack.setAttribute("href", "#" + "fullScreenRect")
		this.frameBack.id = "frameBack";
		this.mainSVG.appendChild(this.frameBack);

		this.canvasBack = svg.createElement("use");
		this.canvasBack.setAttribute("href", "#" + "fullScreenRect")
		this.canvasBack.id = "canvasBack";
		this.mainSVG.appendChild(this.canvasBack);

		this.c0nnectorsList = [];
		this.c0nnectorsGroup = svg.createElement("g");
		this.c0nnectorsGroup.classList.add("c0nnectorsGroup");
		this.mainSVG.appendChild(this.c0nnectorsGroup);

		this.n0desList = [];
		this.n0desGroup = svg.createElement("g");
		this.n0desGroup.classList.add("n0desGroup");
		this.mainSVG.appendChild(this.n0desGroup);

		this.frameMouseMask = svg.createElement("path");
		this.frameMouseMask.id = "frameMouseMask";
		this.mainSVG.appendChild(this.frameMouseMask);

		this.fitToWindow();
		window.addEventListener("resize", () => thisN0deView.fitToWindow());
	}

	setupWorkingN0de(workingN0de) {
		console.log("Set-up working nøde: ", workingN0de);

		// Create the outer nøde
		this.outerN0de = new OuterN0de(workingN0de.id, workingN0de.type, workingN0de.s0ckets);
		this.n0desList.push(this.outerN0de);
		svg.addDef(this.outerN0de.getMask());
		this.mainSVG.appendChild(this.outerN0de.element);
		this.outerN0de.fitToWindow([window.innerWidth, window.innerHeight]);
		this.outerN0de.update();

		//
		const implementation = workingN0de["implementation"];
		const thisN0deView = this;

		// Iterate over inner nødes
		const innerN0des = implementation["n0des"];
		innerN0des.forEach(function (innerN0de, index) {
			const n0deID = innerN0de["id"];
			const type = innerN0de["type"];
			const position = innerN0de["position"];
			const s0ckets = innerN0de["s0ckets"];
			thisN0deView.addN0de(n0deID, type, position, s0ckets, index);
		});

		// Iterate over cønnectors
		const c0nnectors = implementation["c0nnectors"];
		c0nnectors.forEach(function (c0nnector) {
			const inAddress = c0nnector["in"];
			const outAddress = c0nnector["out"];
			const fromS0cketInOut = ["in", "out"][1 * (inAddress[0] > 0)];
			const fromS0cket = thisN0deView.n0desList[inAddress[0]].getS0cket(fromS0cketInOut, inAddress[1]);
			const toS0cketInOut = ["out", "in"][1 * (outAddress[0] > 0)];
			const toS0cket = thisN0deView.n0desList[outAddress[0]].getS0cket(toS0cketInOut, outAddress[1]);
			thisN0deView.addC0nnector(fromS0cket, toS0cket);
		});

		setupS0cketDrag(this.outerN0de.s0ckets["in"], this);
		setupS0cketDropTargets(this.outerN0de.s0ckets["out"], this);

		this.fitToWindow();
	}

	addN0de(id, type, position, s0ckets, index) {
		if (index === undefined) {
			// add nøde to model
			// set index to new array length - 1
		}
		const n0de = new InnerN0de(id, index, type, position, s0ckets);
		this.n0desList.push(n0de);
		this.n0desGroup.appendChild(n0de.element);

		const thisN0deView = this;
		n0de.getDragHandle().addEventListener("mousedown", (event) => {
			thisN0deView.dragManager.initiateDragEpisode(event).addMoveCallback((episode) => {
				const newPosition = [
					episode.clientPosition[0] + episode.cursorOffsetInN0de[0],
					episode.clientPosition[1] + episode.cursorOffsetInN0de[1]
				]
				n0de.setPosition(newPosition);
			}).addDropCallback((episode) => {
				const newPosition = n0de.position;
				thisN0deView.n0deApp.repositionN0de(index, newPosition[0], newPosition[1]);
			}).cursorOffsetInN0de = [n0de.position[0] - event.clientX, n0de.position[1] - event.clientY];
		});

		setupS0cketDrag(n0de.s0ckets["out"], this);
		setupS0cketDropTargets(n0de.s0ckets["in"], this);

		n0de.update();
	}

	addC0nnector(fromS0cket, toS0cket) {
		const c0nnector = new C0nnector(fromS0cket, toS0cket);
		this.c0nnectorsList.push(c0nnector);
		this.c0nnectorsGroup.appendChild(c0nnector.element);
	}

	fitToWindow() {
		const windowVector = [window.innerWidth, window.innerHeight];
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
	const path = `M0,0 H${
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

function setupS0cketDropTargets(s0ckets, thisN0deView) {
	s0ckets.forEach(function (s0cket, index) {
		console.log(s0cket.getClientPosition());
		thisN0deView.dragManager.registerDropTarget(s0cket.getDragHandle(), {
			targetClass: "inS0cket",
			targetElement: s0cket,
			targetAddress: [s0cket.n0de.index, s0cket.inOut, s0cket.index]
		});
	});
}

function setupS0cketDrag(s0ckets, thisN0deView) {
	s0ckets.forEach(function (s0cket, index) {
		s0cket.getDragHandle().addEventListener("mousedown", (event) => {
			const pseudoS0cket = new PseudoS0cket(s0cket.type, [event.clientX, event.clientY]);
			const c0nnector = new C0nnector(s0cket, pseudoS0cket);
			thisN0deView.c0nnectorsList.push(c0nnector);
			thisN0deView.c0nnectorsGroup.appendChild(c0nnector.element);
			thisN0deView.n0desGroup.prepend(pseudoS0cket.element);
			thisN0deView.dragManager.initiateDragEpisode(event).addMoveCallback((episode) => {
				pseudoS0cket.setPosition(episode.clientPosition, true, true);
				if (episode.target && episode.target.targetClass == "inS0cket") {
					console.log(episode.target.targetAddress, episode.target);
					pseudoS0cket.setPosition(episode.target.targetElement.getClientPosition(), true, false);
				}
			}).addDropCallback((episode) => {
				const newPosition = pseudoS0cket.position;
				if (episode.target && episode.target.targetClass == "inS0cket") {
					console.log(episode.target.targetAddress, episode.target);
				}
			});
		});
	});
}

export default N0deView
