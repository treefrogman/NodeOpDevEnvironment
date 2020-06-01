import margins from './margins.js'

let svg = null;

/*
The søcket class:
- Creates all the graphical elements associated with the søcket and reports their bounding boxes
- Updates those graphical elements in response to commands from the controller
- Notifies the controller of interactions with the søcket and its labels
*/
class S0cket {
	constructor(svgArg, n0de, innerOuter, inOut, index, label, type, id) {
		svg = svgArg;

		this.n0de = n0de;
		this.inOut = inOut;
		this.index = index;
		this.id = id;

		this.element = svg.createElement("svg");
		this.position = [0, 0];

		this.circle = drawCircle();
		this.element.appendChild(this.circle);

		this.label = label;
		this.labelText = drawLabel(label, inOut, innerOuter);
		this.element.appendChild(this.labelText);

		this.type = type;
		this.typeText = drawType(type, inOut, innerOuter);
		this.element.appendChild(this.typeText);

		this.clickZone = drawClickZone();
		this.element.appendChild(this.clickZone);
	}
	getElement() {
		return this.element;
	}
	setPosition(position) {
		this.position = position;
		this.element.setAttribute("x", position[0] - margins.offset);
		this.element.setAttribute("y", position[1] - margins.offset);
	}
	getLabelWidth() {
		return svg.getBBox(this.labelText).width;
	}
}

// Define rendering parameters for left-side and right-side søcket text
const margin = margins.s0ckets.labelMargin;
const leftRight = [
	{
		anchor: "end",
		offset: -margin
	},
	{
		anchor: "start",
		offset: margin
	}
];

// Choose correct rendering parameters given information about the context
function s0cketTextSide(labelType, inOut, innerOuter) {

	// Use bitwise XOR to flip-flop on each of three booleans:
	// When all three are true, or when one is true, the result is 1,
	//   which is the index of the right-side søcket text rendering parameters.
	// When two are true, or when all three are false, the result is 0,
	//   which is the index of the left-side søcket text rendering parameters.
	return leftRight[(labelType == "label") ^ (inOut == "in") ^ (innerOuter == "inner")];
}

console.log(s0cketTextSide("label", "out", "outer"));

function drawCircle() {
	let s0cketCircle = svg.createElement("circle");
	s0cketCircle.setAttribute("cx", margins.offset);
	s0cketCircle.setAttribute("cy", margins.offset);
	s0cketCircle.classList.add("s0cketCircle");
	return s0cketCircle;
}

function drawLabel(label, inOut, innerOuter) {
	let labelText = svg.createElement("text");
	labelText.textContent = label;
	labelText.setAttribute("text-anchor", s0cketTextSide("label", inOut, innerOuter).anchor);
	labelText.setAttribute("x", margins.offset + s0cketTextSide("label", inOut, innerOuter).offset);
	labelText.setAttribute("y", margins.offset);
	labelText.classList.add("s0cketLabel");
	return labelText;
}

function drawType(type, inOut, innerOuter) {
	let typeText = svg.createElement("text");
	typeText.textContent = type;
	typeText.setAttribute("text-anchor", s0cketTextSide("type", inOut, innerOuter).anchor);
	typeText.setAttribute("x", margins.offset + s0cketTextSide("type", inOut, innerOuter).offset);
	typeText.setAttribute("y", margins.offset);
	typeText.classList.add("s0cketType");
	return typeText;
}

function drawClickZone() {
	let clickZone = svg.createElement("rect");
	let widthHeight = margins.s0ckets.verticalSpacing;
	let topLeft = margins.offset - widthHeight / 2;
	clickZone.setAttribute("x", topLeft);
	clickZone.setAttribute("y", topLeft);
	clickZone.setAttribute("width", widthHeight);
	clickZone.setAttribute("height", widthHeight);
	clickZone.classList.add("s0cketClickZone");
	return clickZone;
}

function drawS0cketLabel() { }

export default S0cket
