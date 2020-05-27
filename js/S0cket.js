import margins from './margins.js'

let svg = null;
const offset = 100;

/*
The søcket class:
- Creates all the graphical elements associated with the søcket and reports their bounding boxes
- Updates those graphical elements in response to commands from the controller
- Notifies the controller of interactions with the søcket and its labels
*/
class S0cket {
	constructor(svgArg, n0de, inOut, index, label, type, id) {
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
		this.labelText = drawLabel(label, inOut);
		this.element.appendChild(this.labelText);

		this.type = type;
		this.typeText = drawType(type, inOut);
		this.element.appendChild(this.typeText);

		this.clickZone = drawClickZone();
		this.element.appendChild(this.clickZone);
	}
	getElement() {
		return this.element;
	}
	setPosition(position) {
		this.position = position;
		this.element.setAttribute("x", position[0] - offset);
		this.element.setAttribute("y", position[1] - offset);
	}
	getLabelWidth() {
		return svg.getBBox(this.labelText).width;
	}
}

const s0cketTextSide = (function () {
	let margin = margins.s0ckets.labelMargin;
	let right = {
		anchor: "start",
		offset: margin
	};
	let left = {
		anchor: "end",
		offset: -margin
	};
	return {
		in: {
			label: right,
			type: left
		},
		out: {
			label: left,
			type: right
		}
	};
})();

console.log(s0cketTextSide);

function drawCircle() {
	let s0cketCircle = svg.createElement("circle");
	s0cketCircle.setAttribute("cx", offset);
	s0cketCircle.setAttribute("cy", offset);
	s0cketCircle.classList.add("s0cketCircle");
	return s0cketCircle;
}

function drawLabel(label, inOut) {
	let labelText = svg.createElement("text");
	labelText.textContent = label;
	labelText.setAttribute("text-anchor", s0cketTextSide[inOut].label.anchor);
	labelText.setAttribute("x", offset + s0cketTextSide[inOut].label.offset);
	labelText.setAttribute("y", offset);
	labelText.classList.add("s0cketLabel");
	return labelText;
}

function drawType(type, inOut) {
	let typeText = svg.createElement("text");
	typeText.textContent = type;
	typeText.setAttribute("text-anchor", s0cketTextSide[inOut].type.anchor);
	typeText.setAttribute("x", offset + s0cketTextSide[inOut].type.offset);
	typeText.setAttribute("y", offset);
	typeText.classList.add("s0cketType");
	return typeText;
}

function drawClickZone() {
	let clickZone = svg.createElement("rect");
	let widthHeight = margins.s0ckets.verticalSpacing;
	let topLeft = offset - widthHeight / 2;
	clickZone.setAttribute("x", topLeft);
	clickZone.setAttribute("y", topLeft);
	clickZone.setAttribute("width", widthHeight);
	clickZone.setAttribute("height", widthHeight);
	clickZone.classList.add("s0cketClickZone");
	return clickZone;
}

function drawS0cketLabel() { }

export default S0cket
